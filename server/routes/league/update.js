'use strict';

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');

	function compareFn(a, b) {
		if (a.points !== b.points) {
			return b.points - a.points;
		} else if (a.goals.d !== b.goals.d) {
			return b.goals.d - a.goals.d;
		} else {
			return b.goals.f - a.goals.f;
		}
	}

	function compareFnLaLiga(a, b) {
		if (a.points === b.points && a.h2h[b.name].games.p === 2) {
			var h2h = compareFn(a.h2h[b.name], b.h2h[a.name]);

			if (h2h !== 0) {
				return h2h;
			}
		}
			
		return compareFn(a, b);
	}

	function compareFnSerieA(a, b) {
		if (a.points === b.points) {
			var h2h = compareFn(a.h2h[b.name], b.h2h[a.name]);

			if (h2h !== 0) {
				return h2h;
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

	function updateLeague(season, leagueName) {
		var teams = {};

		return Seasons.find({season: season, 'competitions.name': leagueName}).toArray()
			.then(function(seasons) {
				var urlMap = {};
				var i, j, k;
				var season, competition, match;

				for (i in seasons) {
					season = seasons[i];

					teams[season.team] = {
						name: season.team,
						games: {p: 0, w: 0, d: 0, l: 0},
						goals: {d: 0, f: 0, a: 0},
						h2h: {}
					};

					for (j in season.competitions) {
						competition = season.competitions[j];

						if (competition.name === leagueName) {
							for (k in competition.matches) {
								match = competition.matches[k];

								urlMap[match.url] = match;
							}
						}
					}
				}

				for (i in teams) {
					for (j in teams) {
						if (i === j) {
							continue;
						}

						teams[i].h2h[j] = {
							games: {p: 0, w: 0, d: 0, l: 0},
							goals: {d: 0, f: 0, a: 0},
							points: 0,
						};
					}
				}

				var urls = [];
				for (i in urlMap) {
					urls.push(i);
				}

				var proj = {_id: 0, 'summary.l': 1, 'summary.r': 1, 'summary.goals.side': 1};
				return Matches.find({url: {$in: urls}}, proj).toArray();
			}).then(function(matches) {
				var i, j;
				var match;
				var score;
				var teamL, teamR;
				var h2hL, h2hR;

				for (i in matches) {
					match = matches[i].summary;

					score = {l: 0, r: 0};
					for (j in match.goals) {
						score[match.goals[j].side]++;
					}

					teamL = teams[match.l];
					teamR = teams[match.r];

					if (teamL === undefined) {
						console.log(match.l);
					}

					if (teamR === undefined) {
						console.log(match.r);
					}

					h2hL = teamL.h2h[match.r];
					h2hR = teamR.h2h[match.l];

					if (score.l < score.r) {
						teamL.games.l++;
						teamR.games.w++;

						h2hL.games.l++;
						h2hR.games.w++;
						h2hR.points += 3;
					} else if (score.l > score.r) {
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
					
					teamL.goals.f += score.l;
					teamL.goals.a += score.r;
					teamR.goals.f += score.r;
					teamR.goals.a += score.l;

					h2hL.goals.f += score.l;
					h2hL.goals.a += score.r;
					h2hR.goals.f += score.r;
					h2hR.goals.a += score.l;
					
					h2hL.games.p++;
					h2hR.games.p++;
				}

				var team;
				var teamArray = [];
				for (i in teams) {
					team = teams[i];
					team.games.p = team.games.w + team.games.d + team.games.l;
					team.goals.d = team.goals.f - team.goals.a;
					team.points = 3 * team.games.w + team.games.d;
					teamArray.push(team);
				}

				if (leagueName === 'Serie A') {
					if (season === '2006') {
						teams['Juventus'].points -= 91;
						teams['AC Milan'].points -= 30;
						teams['ACF Fiorentina'].points -= 30;
						teams['Lazio Roma'].points -= 30;
					} else if (season === '2007') {
						teams['ACF Fiorentina'].points -= 15;
						teams['Reggina Calcio'].points -= 11;
						teams['AC Milan'].points -= 8;
						teams['Lazio Roma'].points -= 3;
						teams['AC Siena'].points -= 1;
					}
				}

				var cmpFn = compareFn;

				if (leagueName === 'Primera División') {
					cmpFn = compareFnLaLiga;
				} else if (leagueName === 'Serie A') {
					cmpFn = compareFnSerieA;
				}

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

				const league = {
					season: season,
					name: leagueName,
					table: teamArray
				};

				return Leagues.findOneAndReplace({season: season, name: leagueName}, league, {upsert: true});
			});
	}
		
	router.get('/api/league/update/:_season/', function(req, res) {
		const season = req.params._season;
		const leagues = req.query.leagues.split('_');

		var promises = [];
		var i, league;

		for (i = 0; i < leagues.length; i++) {
			league = leagues[i].replace(/-/g, ' ');
			promises.push(updateLeague(season, league));
		}

		Promise.all(promises)
			.then(function () {
				res.sendStatus(200);
			});
	});
		
	router.get('/api/league/update-all/:_season/', function(req, res) {
		const season = req.params._season;

		Leagues.find({season: season}).toArray()
			.then(function(leagues) {
				var promises = [];
				var i, league;

				for (i = 0; i < leagues.length; i++) {
					league = leagues[i];
					promises.push(updateLeague(season, league.name));
				}

				Promise.all(promises)
					.then(function () {
						res.sendStatus(200);
					});
			});
	});
};
