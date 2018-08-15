'use strict';

const path = require('path');

const UrlUtil = require('./url');
const KLeagueUtil = require('./kleague');
const exec = require('./exec');

module.exports = {
	fetch: function(season, team) {
		const teamNameMap = KLeagueUtil.replaceTeamNameMap;
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

		const superleague = [
			'Guangzhou Evergrande',
			'Jiāngsū Sūníng',
			'Beijing Guoan',
			'Guizhou Renhe',
			'Dalian Aerbin',
			'Changchun Yatai',
			'Guangzhou R&F',
			'Tianjin Teda',
			'Shanghai Shenhua',
			'Liáoníng Hóngyùn',
			'Hangzhou Greentown',
			'Shandong Luneng',
			'Qingdao Jonoon',
			'Shanghai Shenxin',
			'Shanghai SIPG',
			'Wuhan Zall FC',
			'Henan Jianye',
			'Harbin Yiteng',
			'Chongqing Lifan',
			'Shijiazhuang Ever Bright',
			'Yanbian FC',
			'Hebei China Fortune FC',
			'Tianjin Quanjian FC',
			'Guizhou Hengfeng',
			'Dalian Yifang FC',
			'Beijing Renhe FC',
		];

		function updateSeason(season, team) {
			const teamUrl = UrlUtil.getUrlFromName(team);
			const execStr = 'perl ' + path.join(__dirname, '../../perl', 'season.pl') + ' ' + season + ' ' + teamUrl;
			return exec(execStr);
		}

		function normalizeJLeagueCompetition(competition) {
			var k, match;

			if (competition.name === 'League Cup') {
				competition.name = 'J League Cup';
			} else if (competition.name === 'Super Cup') {
				competition.name = 'Japanese Super Cup';
			}

			for (k in competition.matches) {
				match = competition.matches[k];
				if (teamNameMap[match.vs]) {
					match.vs = teamNameMap[match.vs];
				}
			}
		}

		function normalizeSuperLeagueCompetition(competition) {
			var k, match;

			if (competition.name === 'Cup') {
				competition.name = 'CFA Cup';
			} else if (competition.name === 'Super Cup') {
				competition.name = 'CFA Super Cup';
			}

			for (k in competition.matches) {
				match = competition.matches[k];
				if (teamNameMap[match.vs]) {
					match.vs = teamNameMap[match.vs];
				}
			}
		}

		if (jleague.includes(team)) {
			var promises = [updateSeason(season, team), updateSeason(season - -1, team)];
			return Promise.all(promises)
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

					return newSeason;
				});
		} else if (superleague.includes(team)) {
			var promises = [updateSeason(season, team), updateSeason(season - -1, team)];
			return Promise.all(promises)
				.then(function (array) {
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

							if (competition.matches[0].date.substring(6,10) === season) {
								normalizeSuperLeagueCompetition(competition);
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

					return newSeason;
				});
		} else {
			return updateSeason(season, team)
				.then(function(data) {
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
						}

						return newSeason;
				});
		}
	}
};
