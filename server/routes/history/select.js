'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Leagues = db.collection('Leagues');
  const Cups = db.collection('Cups');

	router.get('/api/history/team/:_teamUrl', function (req, res) {
    const team = UrlUtil.getNameFromUrl(req.params._teamUrl);

		function formatLeague(league) {
			var i, row;

			for (i = 0; i < league.table.length; i++) {
				row = league.table[i];

				if (row.name === team) {
					return row;
				}
			}
		}

		function getLeague() {
			return Leagues.find({'table.name': team}).toArray()
			.then(leagues => {
				var i, row;
				var result = [];

				for (i = 0; i < leagues.length; i++) {
					row = leagues[i];
					result.push({ season: row.season, name: row.name, league: formatLeague(row) });
				}

				return result.sort(function (a, b) { return b.season - a.season });;
			});
		}

		function formatCup(cup) {
			var i, round;
			var j, match;
			var matches = [];
			var result;

			for (i = cup.rounds.length - 1; i >= 0; i--) {
				round = cup.rounds[i];

				for (j = 0; j < round.matches.length; j++) {
					match = round.matches[j];

					if (match.l === team || match.r === team) {
						matches.push(match);
					}
				}

				if (matches.length > 0) {
					result = { round: round.name, matches: matches, winner: cup.winner };

					if (round.table) {
						result.table = round.table;
					}

					return result;
				}
			}
		}
		
		function getCup() {
			return Cups.find({teams: team}).toArray()
			.then(cups => {
				var i, row;
				var result = [];

				for (i = 0; i < cups.length; i++) {
					row = cups[i];
					result.push({ season: row.season, name: row.name, cup: formatCup(row) });
				}

				return result.sort(function (a, b) { return b.season - a.season });;
			});
		}
				
		var promises = [];
		promises.push(getLeague());
		promises.push(getCup());
		
		Promise.all(promises)
		.then(array => {
			var result = [];
			array.forEach(elem => {
				result = result.concat(elem);
			});

			res.json({team: team, data: result});
		});
	});
	
	router.get('/api/history/competition/:_compUrl', function (req, res) {
    const comp = UrlUtil.getNameFromUrl(req.params._compUrl);
		var result = {name: comp};

		function getLeague() {
			return Leagues.find({ name: comp }).toArray()
			.then(leagues => {
				if (leagues.length > 0)
					result.leagues = leagues.sort(function (a, b) { return b.season - a.season });
			});
		}

		function getCup() {
			return Cups.find({ name: comp }).toArray()
				.then(cups => {
					var i, cup;
					var j, round;
					var results = [];
					var entry;

					for (i = 0; i < cups.length; i++) {
						cup = cups[i];
						entry = { season: cup.season, rounds: [], winner: cup.winner };

						for (j = 0; j < cup.rounds.length; j++) {
							round = cup.rounds[j];

							if (round.name === 'Final' ||
								round.name === 'Third place' ||
								round.name === '3td place' ||
								round.name === 'Semi-finals' ||
								round.name === 'Quarter-finals') {
								entry.rounds.push(round);
							}
						}

						if (entry.rounds.length > 0)
							results.push(entry);
					}

					if (results.length > 0)
						result.cups = results.sort(function (a, b) { return b.season - a.season });;
				});
		}
		
		var promises = [];
		promises.push(getLeague());
		promises.push(getCup());
		
		Promise.all(promises)
		.then(_ => {
			res.json(result);
		});
	});
};
