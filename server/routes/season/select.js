(function() {
	'use strict';

	module.exports = function(router, db) {
		router.get('/season/:_season', function(req, res) {
			var season = req.params._season;

			res.json(season);
		});
	};
}());
