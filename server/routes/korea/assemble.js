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

	function getComp(team, compName, season) {
		var lastComp = team.competitions[team.competitions.length - 1];
		if (lastComp.name === compName)
			return lastComp;

		var comp = { name: compName, url: compName + season, matches: [] };
		team.competitions.push(comp);
		return comp;
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
			var relegations = [];

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
							relegations.push({ league: league.name, game: game, round: round, url: uri });
							continue;
						}
					} else {
						if (((season === '2014' || season === '2017') && round > 36) ||
								((season === '2015' || season === '2016') && round > 44)) {
							relegations.push({ league: league.name, game: game, round: round, url: uri });
							continue;
						}
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
						comp = getComp(teamMap[match.l], cup.name, cup.season);
						game = { date: match.date, place: 'H', round: round.name, vs: match.r };
						if (match.url !== undefined)
							game.url = match.url;
						comp.matches.push(game);
					}

					if (teamMap[match.r]) {
						comp = getComp(teamMap[match.r], cup.name, cup.season);
						game = { date: match.date, place: 'A', round: round.name, vs: match.l };
						if (match.url !== undefined)
							game.url = match.url;
						comp.matches.push(game);
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

			const relegationName = 'K League Relegation';

			relegations.sort((a, b) => { return a.game.date < b.game.date ? -1 : 1 });

			for (i = 0; i < relegations.length; i++) {
				match = relegations[i];
				game = match.game;

				round = (match.league === 'K League 1') ? 'PO' : ((i + 1) + 'R');

				comp = getComp(teamMap[game.home], relegationName, season);
				comp.matches.push({ date: game.date, place: 'H', round: round, vs: game.away, url: match.url });

				comp = getComp(teamMap[game.away], relegationName, season);
				comp.matches.push({ date: game.date, place: 'A', round: round, vs: game.home, url: match.url });
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
