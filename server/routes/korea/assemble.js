'use strict';

const KLeagueUtil = require('../../util/kleague');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const KLeague = db.collection('KLeague');
  const Cups = db.collection('Cups');

	function newTeam(team, league) {
		return {
			season: league.season,
			team: team,
			assembled: true,
			competitions: [ { name: league.name, url: league.name + league.season, matches: [] } ]
		};
	}

	function getCup(team, cup) {
		if (team.competitions[1] === undefined)
			team.competitions[1] = { name: cup.name, url: cup.name + cup.season, matches: [] };
			
		return team.competitions[1];
	}
	
	router.get('/api/korea/assemble/:_season', function(req, res) {
		const season = req.params._season;
		var promises = [];
		promises.push(KLeague.find({ season: season }).toArray());
		promises.push(Cups.findOne({ season: season, name: 'KFA Cup' }));
		promises.push(Cups.findOne({ season: season, name: 'AFC Champions League' }));

		KLeague.find({ season: season }).toArray()
		Promise.all(promises)
		.then(async function (array) {
			var [leagues, cup, acl] = array;
			var teamMap = {};
			var i, league;
			var j, game, uri;
			var season;
			var month, round;

			for (i in leagues) {
				league = leagues[i];
				season = league.season;

				for (j in league.games) {
					game = league.games[j];
					uri = 'KL' + (league.name === 'K League 2' ? 'L' : '') + game.uri;
					round = parseInt(game.round.replace(/R/, ''), 10);

					if (league.name === 'K League 1') {
						month = game.date.substring(0, 2);

						if (month > '10' && round <= 2) {
							continue;
						}
					} else {
						if (((season === '2014' || season === '2017') && round > 36) ||
								((season === '2015' || season === '2016') && round > 44))
							continue;
					}

					if (teamMap[game.home] === undefined) {
						teamMap[game.home] = newTeam(game.home, league);
					}

					teamMap[game.home].competitions[0].matches.push({ date: game.date, place: 'H', round: game.round, vs: game.away, url: uri });

					if (teamMap[game.away] === undefined) {
						teamMap[game.away] = newTeam(game.away, league);
					}
					
					teamMap[game.away].competitions[0].matches.push({ date: game.date, place: 'A', round: game.round, vs: game.home, url: uri });
				}
			}

			var round, match, comp;

			for (i in cup.rounds) {
				round = cup.rounds[i];

				for (j in round.matches) {
					match = round.matches[j];

					if (teamMap[match.l]) {
						comp = getCup(teamMap[match.l], cup);
						comp.matches.push({ date: match.date, place: 'H', round: round.name, vs: match.r, url: match.url });
					}

					if (teamMap[match.r]) {
						comp = getCup(teamMap[match.r], cup);
						comp.matches.push({ date: match.date, place: 'A', round: round.name, vs: match.l, url: match.url });
					}
				}
			}

			const aclTeams = KLeagueUtil.aclTeams;
			var team;
			var k, round, match, entry;
			var place, vs;

			if (aclTeams[season]) {
				if (acl === null) {
					comp = { name: 'AFC Champions League', url: '/all_matches/afc-champions-league-' + season + '/', matches: []};
					for (i = 0; i < aclTeams[season].length; i++) {
						team = aclTeams[season][i];
						teamMap[team].competitions.push(comp);
					}
				} else {
					for (i = 0; i < aclTeams[season].length; i++) {
						team = aclTeams[season][i];
						comp = { name: 'AFC Champions League', url: '/all_matches/afc-champions-league-' + season + '/', matches: []};
					
						for (j = 0; j < acl.rounds.length; j++) {
							round = acl.rounds[j];

							for (k = 0; k < round.matches.length; k++) {
								match = round.matches[k];

								if (!(match.l === team || match.r === team))
									continue;

								place = (match.l === team ? 'H' : 'A');
								vs = (match.l === team ? match.r : match.l);
								comp.matches.push({ date: match.date, place: place, round: round.name, vs: vs, url: match.url });
							}
						}
						
						teamMap[team].competitions.push(comp);
					}
				}
			}

			var bulk = Seasons.initializeUnorderedBulkOp();

			for (i in teamMap) {
				season = teamMap[i];
				bulk.find({ season: season.season, team: season.team }).upsert().update({ $set: { competitions: season.competitions }});
			}

			try {
				var result = await bulk.execute();
			} catch (err) {
				console.log(err);
			}

			res.sendStatus(200);
		});
	});
};
