'use strict';

const SeasonUtil = require('../../util/season');
const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	router.get('/api/season/fetch/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = UrlUtil.getNameFromUrl(teamUrl);
		const Seasons = db.collection('Seasons');

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					SeasonUtil.fetch(season, team)
						.then(function (newSeason) {
							Seasons.insert(newSeason)
								.then(function() {
									res.json(newSeason);
								});
						});
				} else {
					res.json(seasons[0]);
				}
			});
	});
};
