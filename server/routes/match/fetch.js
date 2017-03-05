'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');

	function fetchMatch(season, url) {
		if (url === '')
			return;
		
		return Matches.find({url: url}).toArray()
			.then(function(data) {
				if (data.length > 0)
					return;

				const execStr = 'perl ' + path.resolve('perl', 'pl_match.pl') + ' ' + url;

				return Promise.try(function () {
					exec(execStr, function(error, stdout, stderr) {
						if (stdout === '')
							return;

						const data = JSON.parse(stdout);
						const newMatch = {
							url: url,
							season: season,
							summary: data
						};

						return Matches.insert(newMatch);
					});
				});
			});
	}
	
	router.get('/api/match/fetch-season/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = teamUrl.replace(/-/g, ' ');
		
		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var promises = [];
					var competition, match;
					var matchDate;

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							matchDate = new Date(match.date);

							if (matchDate < new Date()) {
								promises.push(fetchMatch(season, match.url));
							}
						}
					}

					Promise.all(promises)
						.then(function() {
							res.sendStatus(200);
						});
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
					var promises = [];
					var season, competition, match;
					var matchDate;
					var i, j, k;

					for (i in seasons) {
						season = seasons[i];

						for (j in season.competitions) {
							competition = season.competitions[j];

							for (k in competition.matches) {
								match = competition.matches[k];
								matchDate = new Date(match.date);

								if (matchDate < new Date()) {
									promises.push(fetchMatch(season, match.url));
								}
							}
						}
					}

					Promise.all(promises)
						.then(function() {
							res.sendStatus(200);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
