'use strict';

module.exports = function(router, db) {
	router.get('/api/season/select/:_season', function(req, res) {
		const season = req.params._season;
		const Seasons = db.collection('Seasons');
		
		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				res.json(seasons.length > 0 ? seasons[0] : {});
			});
	});
};
