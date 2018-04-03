'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	
	router.get('/api/match/recent/:_season', function(req, res) {
		const season = req.params._season;
		var matchMap = {};
		var now = new Date();
		var tomorrow = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000));
		var weekBefore = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));
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
									teams = (match.place === 'A') ? [match.vs, season.team] : [season.team, match.vs];
									matchMap[match.url] = {
										competition: comp.name,
										round: match.round,
										date: match.date,
										teams: teams,
										url: match.url,
									};
								}
							}
						}
					}

					var matches = [];
					for (i in matchMap) {
						matches.push(i);
					}

					Matches.find({url: {$in: matches}}).toArray()
					.then(function(matches) {
						var i, match;

						for (i in matches) {
							match = matches[i];
							matchMap[match.url].summary = match.summary;
						}

						var result = [];

						for (i in matchMap) {
							result.push(matchMap[i]);
						}

						res.json(result);
					});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
