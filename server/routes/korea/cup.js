'use strict';

const path = require('path');
const exec = require('child_process').exec;

const KLeagueUtil = require('../../util/kleague');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Cups = db.collection('Cups');
	const teamNameMap = KLeagueUtil.cupTeamNameMap;

	const roundNameMap = {
		'1': '1 Round',
		'2': '2 Round',
		'3': '3 Round',
		'4': 'Round of 32',
		'5': 'Round of 16',
		'6': 'Quarter-finals',
		'7': 'Semi-finals',
		'8': 'Final',
	};
	
	function promiseFromChildProcess(child) {
		return new Promise(function (resolve, reject) {
			child.addListener("error", reject);
			child.addListener("exit", resolve);
		});
	}
	
	function fetchCup(year, teamMap) {
		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'kfacup.pl') + ' ' + year;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

				const data = JSON.parse(stdout);

				data.reverse();

				var cup = {name: 'KFA Cup', season: year, rounds: [], assembled: true};
				var rounds = cup.rounds;

				data.forEach(match => {
					var index = match.round - 1;
					if (rounds[index] === undefined)
						rounds[index] = {
							name: roundNameMap[match.round],
							matches: []
						};

					delete match.round;
					match.url = 'KFACUP' + match.url;

					if (teamNameMap[match.l])
						match.l = teamNameMap[match.l];
					
					if (teamNameMap[match.r])
						match.r = teamNameMap[match.r];

					if (!(teamMap[match.l] === true || teamMap[match.r] === true))
						delete match.url;

					rounds[index].matches.push(match);
				});

				// final -> winner
				var match, score, fullScore;
				if (rounds[7] !== undefined) {
					if (rounds[7].matches.length === 1) {
						if (rounds[7].matches[0].score !== undefined) {
							match = rounds[7].matches[0];

							if (match.pk !== undefined) {
								score = match.pk.split(':').map(a => { return parseInt(a, 10); });
							} else {
								score = match.score.split(':').map(a => { return parseInt(a, 10); });
							}
								
							cup.winner = score[0] < score[1] ? match.r : match.l;
						}
					} else if (rounds[7].matches.length === 2) {
						if (rounds[7].matches[1].score !== undefined) {
							match = rounds[7].matches[1];

							if (match.pk !== undefined) {
								fullScore = match.pk.split(':').map(a => { return parseInt(a, 10); });
							} else {
								fullScore = match.score.split(':').map(a => { return parseInt(a, 10); });;
								score = rounds[7].matches[0].score.split(':').map(a => { return parseInt(a, 10); });
								fullScore[0] += score[1];
								fullScore[1] += score[0];
							}
							
							cup.winner = fullScore[0] < fullScore[1] ? match.r : match.l;
						}
					}
				}

				return Cups.findOneAndReplace({season: cup.season, name: cup.name}, cup, {upsert: true});
			});
	}

	function getTeams(season) {
		return Seasons.find({season: season}).toArray()
		.then(function (seasons) {
			var map = {};

			seasons.forEach(season => { map[season.team] = true; });

			return map;
		});
	}
	
	router.get('/api/korea/cup/update/:_season/', function(req, res) {
		const season = req.params._season;

		getTeams(season)
		.then(map => {
			return fetchCup(season, map);
		}).then(function () {
			res.sendStatus(200);
		});
	});
}
