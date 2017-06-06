'use strict';

const path = require('path');
const exec = require('child_process').exec;

module.exports = function(router, db) {

	router.get('/api/season/fetch/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = teamUrl.replace(/-/g, ' ');
		const Seasons = db.collection('Seasons');

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					const execStr = 'perl ' + path.resolve('perl', 'season.pl') + ' ' + season + ' ' + teamUrl;

					exec(execStr, function(error, stdout, stderr) {
						const data = JSON.parse(stdout);
						const newSeason = {
							season: season,
							team: team,
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
