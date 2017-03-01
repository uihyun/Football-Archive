'use strict';

module.exports = function(router, db) {

	router.get('/api/season/clear/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = teamUrl.replace(/-/g, ' ');
		const Seasons = db.collection('Seasons');

		Seasons.remove({season: season, team: team})
			.then(function() {
				res.sendStatus(200);
			});
	});
};
