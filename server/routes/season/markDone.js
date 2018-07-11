'use strict';

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {

	router.get('/api/season/mark_done/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const team = UrlUtil.getNameFromUrl(req.params._teamUrl);
		const Seasons = db.collection('Seasons');

		Seasons.update({season: season, team: team}, { $set: { done: true } })
			.then(function() {
				res.sendStatus(200);
			});
	});
};
