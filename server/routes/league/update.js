'use strict';

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');

	function compareFn(a, b) {
		if (a.points !== b.points) {
			return b.points - a.points;
		} else {
			return b.goals.d - a.goals.d;
		}
	}

	router.get('/api/league/update/:_season/:_leagueUrl', function(req, res) {
		const season = req.params._season;
		const leagueUrl = req.params._leagueUrl;
		const leagueName = leagueUrl.replace(/-/g, ' ');
		var teams = {};

		Seasons.find({season: season, 'competitions.name': leagueName}).toArray()
			.then(function(seasons) {
				var urlMap = {};
				var i, j, k;
				var season, competition, match;

				for (i in seasons) {
					season = seasons[i];

					teams[season.team] = {
						name: season.team,
						games: {p: 0, w: 0, d: 0, l: 0},
						goals: {d: 0, f: 0, a: 0}
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

				for (i in matches) {
					match = matches[i].summary;

					score = {l: 0, r: 0};
					for (j in match.goals) {
						score[match.goals[j].side]++;
					}

					teamL = teams[match.l];
					teamR = teams[match.r];

					if (score.l < score.r) {
						teamL.games.l++;
						teamR.games.w++;
					} else if (score.l > score.r) {
						teamL.games.w++;
						teamR.games.l++;
					} else {
						teamL.games.d++;
						teamR.games.d++;
					}
					
					teamL.goals.f += score.l;
					teamL.goals.a += score.r;
					teamR.goals.f += score.r;
					teamR.goals.a += score.l;
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

				teamArray.sort(compareFn);

				var prevRank = 1;
				teamArray[0].rank = 1;
				for (i = 1; i < teamArray.length; i++) {
					team = teamArray[i];
					if (compareFn(teamArray[i-1], team) === 0) {
						team.rank = prevRank;
					} else {
						team.rank = prevRank = i+1;
					}
				}

				const league = {
					season: season,
					name: leagueName,
					table: teamArray
				};

				return Leagues.findOneAndReplace({season: season, name: leagueName}, league, {upsert: true});
			}).then(function() {
				res.sendStatus(200);
			});
	});
};
