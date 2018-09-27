'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');
	const Cups = db.collection('Cups');
	const Quals = db.collection('Qualifiers');

	router.get('/api/season/select/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const team = UrlUtil.getNameFromUrl(req.params._teamUrl);

		function getMatches(urls, map) {
			return Matches.find({url: {$in: urls}}).toArray()
				.then(function(matches) {
					var match;
					for (var i in matches) {
						match = matches[i];

						map[match.url].summary = match.summary;
					}
				});
		}

		function getLeagueTables(season, team, obj) {
			return Leagues.find({season: season, 'table.name': team}).toArray()
				.then(function(leagues)	{
					obj.leagues = leagues;
				});
		}

		function getCups(season, team, obj) {
			return Cups.find({season: season, teams: team}, {teams: 0}).toArray()
				.then(function(cups)	{
					obj.cups = cups;
				});
		}

		function getQuals(season, team, obj) {
			return Quals.find({season: season, teams: team}, {teams: 0}).toArray()
				.then(function(quals)	{
					obj.quals = quals;
				});
		}

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0)
					res.json({});
				else {
					var urls = [];
					var competition, match;
					var map = {};

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							urls.push(match.url);
							map[match.url] = match;
						}
					}

					var promises = [];
					promises.push(getMatches(urls, map));
					promises.push(getLeagueTables(season, team, seasons[0]));
					promises.push(getCups(season, team, seasons[0]));
					promises.push(getQuals(season, team, seasons[0]));

					Promise.all(promises)
						.then(function() {
							res.json(seasons[0]);
						});
				}
			});
	});
	
	router.get('/api/season/select/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season}, {_id: 0, team: 1}).toArray()
			.then(function(seasons) {
				res.json(seasons.length > 0 ? seasons : {});
			});
	});
};
