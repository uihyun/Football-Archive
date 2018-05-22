'use strict';

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

		KLeague.find({ season: season }).toArray()
		Promise.all(promises)
		.then(async function (array) {
			var [leagues, cup] = array;
			var teamMap = {};
			var i, league;
			var j, game, uri;

			for (i in leagues) {
				league = leagues[i];

				for (j in league.games) {
					game = league.games[j];
					uri = 'KL' + (league.name === 'kleague2' ? 'L' : '') + game.uri;

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

			var season;
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
