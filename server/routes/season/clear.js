'use strict';

module.exports = function(router, db) {

	router.get('/api/season/clear/:_season', function(req, res) {
		const season = req.params._season;
		const Seasons = db.collection('Seasons');

		Seasons.remove({season: season})
			.then(function() {
				res.sendStatus(200);
			});
	});
};
