'use strict';

const path = require('path');
const exec = require('child_process').exec;

module.exports = function(router, db) {

	router.get('/api/season/fetch/:_season', function(req, res) {
		const season = req.params._season;
		const Seasons = db.collection('Seasons');

		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					const execStr = 'perl ' + path.resolve('perl', 'mu_season.pl') + ' ' + season;

					exec(execStr, function(error, stdout, stderr) {
						const data = JSON.parse(stdout);
						const newSeason = {
							season: season,
							competitions: data
						};

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
