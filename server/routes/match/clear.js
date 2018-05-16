'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	
	router.get('/api/match/clear/recent/:_season', function(req, res) {
		const season = req.params._season;
		var matches = [];
		var now = new Date();
		var tomorrow = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000));
		var weekBefore = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
		var matchDate;
		
		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var i, j, k;
					var season, comp, match, teams;

					for (i in seasons) {
						season = seasons[i];

						for (j in season.competitions) {
							comp = season.competitions[j];

							for (k in comp.matches) {
								match = comp.matches[k];
								matchDate = new Date(match.date);

								if (matchDate >= weekBefore && matchDate <= tomorrow) {
									matches.push(match.url);
								}
							}
						}
					}

					Matches.remove({url: {$in: matches}})
						.then(function() {
							res.sendStatus(200);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
	
	router.get('/api/match/clear/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const team = UrlUtil.getNameFromUrl(req.params._teamUrl);
		
		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var promises = [];
					var competition, match;
					var matchDate;
					var urls = [];

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							urls.push(match.url);
						}
					}

					Matches.remove({url: {$in: urls}})
						.then(function() {
							res.sendStatus(200);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
	
	router.get('/api/match/clear/:_season/', function(req, res) {
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

					Matches.remove({url: {$in: urls}})
						.then(function() {
							res.sendStatus(200);
						});
				}
			})

	});
};
