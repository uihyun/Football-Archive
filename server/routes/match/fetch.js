'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');

	function promiseFromChildProcess(child) {
		return new Promise(function (resolve, reject) {
			child.addListener("error", reject);
			child.addListener("exit", resolve);
		});
	}

	function fetchMatchUrl(url) {
		if (url === '')
			return;

		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'match.pl') + ' ' + url;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

				const data = JSON.parse(stdout);
				const newMatch = {
					url: url,
					summary: data
				};

				return Matches.insert(newMatch);
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});
	}

	function fetchThenRespond(res, urls) {
		Matches.find({url: {$in: urls}}, {_id: 0, url: 1}).toArray()
			.then(function(matches) {
				var fetchUrls = [];
				var urlMap = {};
				var i, url;

				for (var i in matches) {
					urlMap[matches[i].url] = true;
				}

				for (var i in urls) {
					url = urls[i];
					if (urlMap[url] === undefined) {
						fetchUrls.push(url);
					}
				}

				Promise.map(fetchUrls, function (url) {
					return fetchMatchUrl(url);
				}, {concurrency: 8})
				.then(function () {
					res.sendStatus(200);
				});
			});
	}
	
	router.get('/api/match/fetch-season/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const team = UrlUtil.getTeamNameFromUrl(req.params._teamUrl);
		
		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var competition, match;
					var matchDate;
					var urls = [];

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							matchDate = new Date(match.date);

							if (matchDate < new Date()) {
								urls.push(match.url);
							}
						}
					}

					fetchThenRespond(res, urls);	
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
	
	router.get('/api/match/fetch-season/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var season, competition, match;
					var matchDate;
					var i, j, k;
					var urlMap = {};

					for (i in seasons) {
						season = seasons[i];

						for (j in season.competitions) {
							competition = season.competitions[j];

							for (k in competition.matches) {
								match = competition.matches[k];
								matchDate = new Date(match.date);

								if (matchDate < new Date()) {
									urlMap[match.url] = match.url;
								}
							}
						}
					}

					var urls = [];
					for (i in urlMap) {
						urls.push(i);
					}

					fetchThenRespond(res, urls);	
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
