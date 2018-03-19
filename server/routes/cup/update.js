'use strict';

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Matches = db.collection('Matches');
  const Cups = db.collection('Cups');

	function isTournament(competition) {
		switch (competition) {
			case 'Premier League':
			case 'Primera División':
			case 'Bundesliga':
			case 'Serie A':
			case 'Ligue 1':
			case 'Champions League Qual.':
			case 'Europa League Qual.':
			case 'UEFA-Supercup':
			case 'Club World Cup':
			case 'FA Community Shield':
			case 'Supercopa':
			case 'Supercup':
			case 'Supercoppa':
			case 'Trophée des Champions':
				return false;
			default:
				return true;
		}
	}

	function replaceCup(season, cup) {
		return Cups.findOneAndReplace({season: season, name: cup.name}, cup, {upsert: true});
	}

	function getWinner(match) {
		var score;
		var teamL, teamR;
		var i, j;

		score = {l: 0, r: 0};
		if (match.penalties) {
			for (j in match.penalties) {
				score[match.goals[j].side]++;
			}
		} else {
			for (j in match.goals) {
				score[match.goals[j].side]++;
			}
		}

		if (score.l > score.r) {
			return match.l;
		} else {
			return match.r;
		}
	}

	function updateCup(season) {
		var cups = {};

		return Seasons.find({season: season}).toArray()
		.then(function(seasons) {
			var season;
			var competition, cup;
			var match, round;
			var i, j, k;

			for (i in seasons) {
				season = seasons[i];

				for (j in season.competitions) {
					competition = season.competitions[j];

					if (isTournament(competition.name) == false) {
						continue;
					}

					if (cups[competition.name] === undefined) {
						cups[competition.name] = {
							season: season.season,
							name: competition.name,
							rounds: {},
							finalMatch: null
						}
					}

					cup = cups[competition.name];
					for (k in competition.matches) {
						match = competition.matches[k];
						round = match.round;

						if (cup.rounds[round] === undefined) {
							cup.rounds[round] = {
								name: round,
								matches: []
							}
						}

						cup.rounds[round].matches.push({
							date: match.date,
							place: match.place,
							teamA: season.team,
							teamB: match.vs
						});

						if (round === 'Final') {
							cup.finalMatch = match.url;
						}
					}
				}
			}

			var urls = [];
			var rounds;
			var matches;
			var teams;
			var match, teamA, teamB;
			for (i in cups) {
				cup = cups[i];
				if (cup.finalMatch !== null) {
					urls.push(cup.finalMatch);
				}

				rounds = [];
				for (j in cup.rounds) {
					round = cup.rounds[j];
					matches = [];
					teams = {};

					for (k in round.matches) {
						match = round.matches[k];
						teamA = match.teamA;
						teamB = match.teamB;

						if (teams[teamA] === undefined) {
							matches.push([teamA, teamB]);
						}
						
						teams[teamA] = true;
						teams[teamB] = true;
					}

					round.matches = matches;
					rounds.push(round);
				}

				cup.rounds = rounds;
			}
			
			var proj = {_id: 0, 'url': 1, 'summary.l': 1, 'summary.r': 1, 'summary.goals.side': 1, 'summary.goals.penalties.side': 1};
			return Matches.find({url: {$in: urls}}, proj).toArray();
		}).then(function(matches) {
			var promises = [];
			var i, j;
			var cup, match, winner;

			for (i in matches) {
				match = matches[i];
				winner = getWinner(match.summary);

				for (j in cups) {
					cup = cups[j];
					if (cup.finalMatch === match.url) {
						cup.winner = winner;
					}
				}
			}

			for (i in cups) {
				promises.push(replaceCup(season, cups[i]));
			}

			return Promise.all(promises);
		});
	}

	router.get('/api/cup/update/:_season/', function(req, res) {
    const season = req.params._season;

		updateCup(season)
		.then(function() {
			res.sendStatus(200);
		});
	});
};
