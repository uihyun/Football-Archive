'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');

const UrlUtil = require('../../util/url');
const KLeagueUtil = require('../../util/kleague');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const teamNameMap = KLeagueUtil.aclTeamNameMap;

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
							
				var competitions = [];
				var i, j, competition;

				if (season === '2011' && team === 'Fulham FC') {
					for (i in data) {
						competition = data[i];
						if (competition.name !== 'Europa League Qual.') {
							competitions.push(competition);
						}
					}

					newSeason.competitions = competitions;
				} else {
					for (i in data) {
						competition = data[i];
						// normalization for J League seasons
						if (competition.name === 'J1 League') {
							for (var j in data) {
								competition = data[j];
								if (competition.matches[0].date.substring(6,10) === season) {
									if (competition.name === 'League Cup') {
										competition.name = 'J League Cup';
									} else if (competition.name === 'AFC Champions League') {
										for (var k in competition.matches) {
											match = competition.matches[k];
											if (teamNameMap[match.vs]) {
												match.vs = teamNameMap[match.vs];
											}
										}
									}

									competitions.push(competition);
								}
								newSeason.competitions = competitions;
							}
							break;
						}
					}
				}

				return Seasons.replaceOne({season: season, team: team}, newSeason);
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});
	}

	router.get('/api/season/update/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season, done: { $ne: true }}).toArray()
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
