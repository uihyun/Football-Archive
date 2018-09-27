'use strict';

const Promise = require('bluebird');

const SeasonUtil = require('../../util/season');
const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	
	function updateSeason(season, team) {
		SeasonUtil.fetch(season, team)
			.then(function (newSeason) {
				return Seasons.replaceOne({season: season, team: team}, newSeason);
			});
	}

	router.get('/api/season/update/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season, done: { $ne: true }}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var teams = [];
					var i;

					for (i in seasons) {
						if (seasons[i].assembled !== true) {
							teams.push(seasons[i].team);
						}
					}
					
					Promise.map(teams, function (team) {
						return updateSeason(season, team);
					}, {concurrency: 8})
					.then(function () {
						res.sendStatus(200);
					});
				}
			});
	});
};
