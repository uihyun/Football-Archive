'use strict';

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const KLeague = db.collection('KLeague');

	function newTeam(team, league) {
		return {
			season: league.season,
			team: team,
			assembled: true,
			competitions: [ { name: league.name, url: league.name + league.season, matches: [] } ]
		};
	}
	
	router.get('/api/korea/league/assemble/:_season', function(req, res) {
		const season = req.params._season;

		KLeague.find({ season: season }).toArray()
		.then(async function (leagues) {
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
