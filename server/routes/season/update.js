'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');

	function promiseFromChildProcess(child) {
		return new Promise(function (resolve, reject) {
			child.addListener("error", reject);
			child.addListener("exit", resolve);
		});
	}
	
	function updateSeason(season, team) {
		const teamUrl = UrlUtil.getUrlFromName(team);
		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'season.pl') + ' ' + season + ' ' + teamUrl;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

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

				return Seasons.replaceOne({season: season, team: team}, newSeason);
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});
	}

	router.get('/api/season/update/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var teams = [];
					var i;

					for (i in seasons) {
						if (seasons[i].assembled !== true) {
							teams.push(seasons[i].team);
						}
					}
					
					Promise.map(teams, function (team) {
						return updateSeason(season, team);
					}, {concurrency: 8})
					.then(function () {
						res.sendStatus(200);
					});
				}
			});
	});
};
