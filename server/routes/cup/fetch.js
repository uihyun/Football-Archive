'use strict';

const path = require('path');
const exec = require('child_process').exec;

const CupUtil = require('../../util/cup');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Matches = db.collection('Matches');
  const Cups = db.collection('Cups');

	function promiseFromChildProcess(child) {
		return new Promise(function (resolve, reject) {
			child.addListener("error", reject);
			child.addListener("exit", resolve);
		});
	}

	function getEmptyTeam(name) {
		return {
			name: name,
			games: {p: 0, w: 0, d: 0, l: 0},
			goals: {d: 0, f: 0, a: 0},
			h2h: {}
		};
	}

	function getEmptyH2H() {
		return {
			games: {p: 0, w: 0, d: 0, l: 0},
			goals: {d: 0, f: 0, a: 0, away: 0},
			points: 0
		};
	}

	function compareFn(a, b) {
		if (a.points !== b.points) {
			return b.points - a.points;
		} else if (a.goals.d !== b.goals.d) {
			return b.goals.d - a.goals.d;
		} else {
			return b.goals.f - a.goals.f;
		}
	}

	function compareFnH2H(a, b) {
		if (a.points === b.points) {
			var h2h = compareFn(a.h2h[b.name], b.h2h[a.name]);

			if (h2h !== 0) {
				return h2h;
			} else if (a.h2h[b.name].goals.away !== b.h2h[a.name].goals.away) {
				return b.h2h[a.name].goals.away - a.h2h[b.name].goals.away;
			}
		}
			
		return compareFn(a, b);
	}

	function compareFnWithName(a, b) {
		if (a.rank === b.rank) {
			return (a.name < b.name) ? -1 : 1;
		} else {
			return a.rank - b.rank;
		}
	}

	function getGroupTable(group, competition) {
		var teamMap = {};
		var i, match;
		var teamL, teamR;
		var h2hL, h2hR;
		var score;

		for (i = 0; i < group.matches.length; i++) {
			match = group.matches[i];
			if (teamMap[match.l] === undefined)
				teamMap[match.l] = getEmptyTeam(match.l);
			if (teamMap[match.r] === undefined)
				teamMap[match.r] = getEmptyTeam(match.r);

			if (teamMap[match.l].h2h[match.r] === undefined)
				teamMap[match.l].h2h[match.r] = getEmptyH2H();
			if (teamMap[match.r].h2h[match.l] === undefined)
				teamMap[match.r].h2h[match.l] = getEmptyH2H();
		}

		for (i = 0; i < group.matches.length; i++) {
			match = group.matches[i];
			
			teamL = teamMap[match.l];
			teamR = teamMap[match.r];

			h2hL = teamL.h2h[match.r];
			h2hR = teamR.h2h[match.l];

			if (match.score === undefined)
				continue;

			score = match.score.split(':').map(a => { return parseInt(a, 10); });
			if (score[0] < score[1]) {
				teamL.games.l++;
				teamR.games.w++;

				h2hL.games.l++;
				h2hR.games.w++;
				h2hR.points += 3;
			} else if (score[0] > score[1]) {
				teamL.games.w++;
				teamR.games.l++;

				h2hL.games.w++;
				h2hR.games.l++;
				h2hL.points += 3;
			} else {
				teamL.games.d++;
				teamR.games.d++;

				h2hL.games.d++;
				h2hR.games.d++;
				h2hL.points++;
				h2hR.points++;
			}
					
			teamL.goals.f += score[0];
			teamL.goals.a += score[1];
			teamR.goals.f += score[1];
			teamR.goals.a += score[0];

			h2hL.goals.f += score[0];
			h2hL.goals.a += score[1];
			h2hR.goals.f += score[1];
			h2hR.goals.a += score[0];
			h2hR.goals.away += score[1];

			h2hL.games.p++;
			h2hR.games.p++;
		}
				
		var team;
		var teamArray = [];
		for (i in teamMap) {
			team = teamMap[i];
			team.games.p = team.games.w + team.games.d + team.games.l;
			team.goals.d = team.goals.f - team.goals.a;
			team.points = 3 * team.games.w + team.games.d;
			teamArray.push(team);
		}
				
		var cmpFn = CupUtil.useH2H(competition) ? compareFnH2H : compareFn;
		teamArray.sort(cmpFn);

		var prevRank = 1;
		teamArray[0].rank = 1;
		for (i = 1; i < teamArray.length; i++) {
			team = teamArray[i];
			if (cmpFn(teamArray[i-1], team) === 0) {
				team.rank = prevRank;
			} else {
				team.rank = prevRank = i+1;
			}
		}

		teamArray.sort(compareFnWithName);

		for (i = 0; i < teamArray.length; i++) {
			delete teamArray[i].h2h;
		}

		return teamArray; 
	}

	function fetchCup(cup) {
		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'cup.pl') + ' ' + cup.url;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

				const data = JSON.parse(stdout);

				var i, round;
				var j, match;
				var score;
				var teams = {};

				for (i = 0; i < data.length; i++) {
					round = data[i];

					for (j = 0; j < round.matches.length; j++) {
						match = round.matches[j];

						if (cup.teamMap[match.l] !== true &&
								cup.teamMap[match.r] !== true) {
							delete match.url;
						}

						teams[match.l] = true;
						teams[match.r] = true;
					}

					if (round.name.startsWith('Group')) {
						round.table = getGroupTable(round, cup.name);
					}
					
					if (round.name === 'Final' && 
							round.matches.length === 1 && 
							round.matches[0].score !== undefined) {
						if (match.pk !== undefined) {
							score = match.pk.split(':').map(a => { return parseInt(a, 10); });
						} else {
							score = match.score.split(':').map(a => { return parseInt(a, 10); });
						}
						cup.winner = score[0] < score[1] ? match.r : match.l;
					}
				}

				delete cup.teamMap;
				cup.rounds = data;

				var teamArray = [];
				for (i in teams) {
					teamArray.push(i);
				}
				cup.teams = teamArray;
		
				return Cups.findOneAndReplace({season: cup.season, name: cup.name}, cup, {upsert: true});
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});					
	}

	function getCups(season) {
		return Cups.find({season: season}).toArray();
	}
	
	function getSeasons(season) {
		return Seasons.find({season: season}).toArray();
	}

	function getCupMap(seasons) {
		var cups = {};
		var season;
		var competition, cup;
		var match, round;
		var i, j, k;
		var promises = [];

		for (i in seasons) {
			season = seasons[i];

			for (j in season.competitions) {
				competition = season.competitions[j];

				if (CupUtil.isValid(competition.name) == false) {
					continue;
				}

				if (cups[competition.name] === undefined) {
					cups[competition.name] = {
						season: season.season,
						name: competition.name,
						url: competition.url,
						teamMap: {}
					};
				}

				cups[competition.name].teamMap[season.team] = true;
			}
		}

		return cups;
	}

	function fetchCups(season) {
		var cups = {};

		return getSeasons(season)
		.then(function(seasons) {
			var promises = [];
			var i, cup;
			cups = getCupMap(seasons);

			for (i in cups) {
				cup = cups[i];
				promises.push(fetchCup(cup));
			}

			return Promise.all(promises);
		});
	}

	router.get('/api/cup/fetch/old/', function(req, res) {
		const oldCups = CupUtil.oldCups;
		var promises = [];
		var i, cup;
		
		for (i = 0; i < oldCups.length; i++) {
			cup = oldCups[i];
			cup.teamMap = {};
			promises.push(fetchCup(cup));
		}

		Promise.all(promises)
		.then(_ => {
			res.sendStatus(200);
		});
	});
	
	router.get('/api/cup/fetch/ongoing/:_season/', function(req, res) {
    const season = req.params._season;
		var promises = [getCups(season), getSeasons(season)];

		Promise.all(promises)
		.then(function ([cups, seasons]) {
			var map = getCupMap(seasons);
			var promises = [];
			var i, cup;

			for (i = 0; i < cups.length; i++) {
				cup = cups[i];

				if (cup.winner !== undefined)
					continue;

				promises.push(fetchCup(map[cup.name]));
			}

			return Promise.all(promises);
		}).then(_ => {
			res.sendStatus(200);
		});
	});

	router.get('/api/cup/fetch/:_season/', function(req, res) {
    const season = req.params._season;
			
		fetchCups(season)
		.then(_ => {
			res.sendStatus(200);
		});
	});
};
