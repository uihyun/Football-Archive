'use strict';

const path = require('path');

const KLeagueUtil = require('../../util/kleague');
const exec = require('../../util/exec');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Cups = db.collection('Cups');
	const teamNameMap = KLeagueUtil.cupTeamNameMap;
	const teamNormalizeNameMap = KLeagueUtil.cupTeamNormalizeNameMap;

	const roundNameMapNew = {
		'1': '1 Round',
		'2': '2 Round',
		'3': '3 Round',
		'4': 'Round of 32',
		'5': 'Round of 16',
		'6': 'Quarter-finals',
		'7': 'Semi-finals',
		'8': 'Final',
	};

	const roundNameMapOld = {
		'1': '1 Round',
		'2': '2 Round',
		'3': 'Round of 32',
		'4': 'Round of 16',
		'5': 'Quarter-finals',
		'6': 'Semi-finals',
		'7': 'Final',
	};
	
	function fetchCup(year, teamMap) {
		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'kfacup.pl') + ' ' + year;
		var roundNameMap, finalIndex;

		if (year <= 2014) {
			roundNameMap = roundNameMapOld;
			finalIndex = 6;
		} else {
			roundNameMap = roundNameMapNew;
			finalIndex = 7;
		}

		return exec(execStr)
		.then(function (data) {
			if (data === '')
				return;


			var cup = {name: 'KFA Cup', season: year, rounds: [], assembled: true};
			var rounds = cup.rounds;
			var teams = {};

			data.forEach(match => {
				var index = match.round - 1;
				if (rounds[index] === undefined)
					rounds[index] = {
						name: roundNameMap[match.round],
						matches: []
					};

				delete match.round;

				if (teamNameMap[match.l])
					match.l = teamNameMap[match.l];

				if (teamNameMap[match.r])
					match.r = teamNameMap[match.r];

				if (teamNormalizeNameMap[match.l])
					match.l = teamNormalizeNameMap[match.l];

				if (teamNormalizeNameMap[match.r])
					match.r = teamNormalizeNameMap[match.r];

				if (match.url !== undefined &&
					(teamMap[match.l] === true || teamMap[match.r] === true)) {
					match.url = 'KFACUP' + match.url;
				}

				teams[match.l] = true;
				teams[match.r] = true;

				rounds[index].matches.push(match);
			});

			var teamArray = [];
			for (var i in teams) {
				teamArray.push(i);
			}
			cup.teams = teamArray;

			// final -> winner
			var match, score, fullScore;
			if (rounds[finalIndex] !== undefined) {
				if (rounds[finalIndex].matches.length === 1) {
					if (rounds[finalIndex].matches[0].score !== undefined) {
						match = rounds[finalIndex].matches[0];

						if (match.pk !== undefined) {
							score = match.pk.split(':').map(a => { return parseInt(a, 10); });
						} else {
							score = match.score.split(':').map(a => { return parseInt(a, 10); });
						}

						cup.winner = score[0] < score[1] ? match.r : match.l;
					}
				} else if (rounds[finalIndex].matches.length === 2) {
					if (rounds[finalIndex].matches[1].score !== undefined) {
						match = rounds[finalIndex].matches[1];

						if (match.pk !== undefined) {
							fullScore = match.pk.split(':').map(a => { return parseInt(a, 10); });
						} else {
							fullScore = match.score.split(':').map(a => { return parseInt(a, 10); });;
							score = rounds[finalIndex].matches[0].score.split(':').map(a => { return parseInt(a, 10); });
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
