'use strict';

module.exports = function(router, db) {
  const Goals = db.collection('Goals');
	
	router.get('/api/goal/select/:_season/', function(req, res) {
		const season = req.params._season;

		Goals.find({season: season}).toArray()
		.then(function (goals) {
			res.json(goals);
		});
	});
};
