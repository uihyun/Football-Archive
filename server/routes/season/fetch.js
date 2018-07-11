'use strict';

const path = require('path');
const exec = require('child_process').exec;

const UrlUtil = require('../../util/url');
const KLeagueUtil = require('../../util/kleague');

module.exports = function(router, db) {
	const teamNameMap = KLeagueUtil.aclTeamNameMap;
	const jleague = [
		'Consadole Sapporo',
		'Vegalta Sendai',
		'Montedio Yamagata',
		'Kashima Antlers',
		'Urawa Red Diamonds',
		'Omiya Ardija',
		'Kashiwa Reysol',
		'FC Tokyo',
		'Kawasaki Frontale',
		'Yokohama F. Marinos',
		'Shonan Bellmare',
		'Ventforet Kofu',
		'Matsumoto Yamaga',
		'Albirex Niigata',
		'Shimizu S-Pulse',
		'Júbilo Iwata',
		'Nagoya Grampus',
		'Gamba Osaka',
		'Cerezo Osaka',
		'Vissel Kobe',
		'Sanfrecce Hiroshima',
		'Tokushima Vortis',
		'Avispa Fukuoka',
		'Sagan Tosu',
		'V-Varen Nagasaki',
		'Oita Trinita',
	];

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

				return JSON.parse(stdout);
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});
	}

	function normalizeJLeagueCompetition(competition) {
		var k, match;

		if (competition.name === 'League Cup') {
			competition.name = 'J League Cup';
		} else if (competition.name === 'AFC Champions League') {
			for (k in competition.matches) {
				match = competition.matches[k];
				if (teamNameMap[match.vs]) {
					match.vs = teamNameMap[match.vs];
				}
			}
		}
	}

	router.get('/api/season/fetch/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = UrlUtil.getNameFromUrl(teamUrl);
		const Seasons = db.collection('Seasons');

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {

					if (jleague.includes(team)) {
						var promises = [updateSeason(season, team), updateSeason(season - -1, team)];
						Promise.all(promises)
						.then(function (array) {
							var jleague = {
								name: 'J1 League',
								url: '/all_matches/jpn-j1-league-' + season + '/',
								matches: []
							};

							var newSeason = {
								season: season,
								team: team,
								competitions: []
							};

							var i, year;
							var j, competition;
							var k, match, round, found;

							for (i in array) {
								year = array[i];

								for (j in year) {
									competition = year[j];

									if (competition.name === 'J')
										continue;

									if (competition.matches[0].date.substring(6,10) === season) {
										if (competition.name.match(/^J1 League.*Phase/)) {
											if (competition.name.match(/2. Phase$/)) {
												for (k in competition.matches) {
													match = competition.matches[k];
													match.round = (parseInt(match.round.replace(' Round')) + 17) + ' Round';
												}
											}
											jleague.matches = jleague.matches.concat(competition.matches);
										} else {
											normalizeJLeagueCompetition(competition);
											found = false;

											for (k in newSeason.competitions) {
												if (newSeason.competitions[k].name === competition.name) {
													found = true;
													break;
												}
											}

											if (found === false)
												newSeason.competitions.push(competition);
										}
									}
								}
							}

							if (jleague.matches.length > 0)
								newSeason.competitions.push(jleague);

							Seasons.insert(newSeason)
								.then(function() {
									res.json(newSeason);
								});
						});
						return;
					}

					const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'season.pl') + ' ' + season + ' ' + teamUrl;

					exec(execStr, function(error, stdout, stderr) {
						const data = JSON.parse(stdout);
						var newSeason = {
							season: season,
							team: team,
							competitions: data
						};
							
						var competitions = [];
						var i, j, competition, match;
									
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
											normalizeJLeagueCompetition(competition);
											competitions.push(competition);
										}
										newSeason.competitions = competitions;
									}
									break;
								}
							}
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
