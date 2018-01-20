'use strict';

const path = require('path');
const exec = require('child_process').exec;

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {

	router.get('/api/season/fetch/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = UrlUtil.getTeamNameFromUrl(teamUrl);
		const Seasons = db.collection('Seasons');

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'season.pl') + ' ' + season + ' ' + teamUrl;

					exec(execStr, function(error, stdout, stderr) {
						const data = JSON.parse(stdout);
						var newSeason = {
							season: season,
							team: team,
							competitions: data
						};

						if (season === '2011' && team === 'Fulham FC') {
							var competitions = [];
							var competition;

							for (var i in data) {
								competition = data[i];
								if (competition.name !== 'Europa League Qual.') {
									competitions.push(competition);
								}
							}

							newSeason.competitions = competitions;
						}

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
