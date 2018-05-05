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

				return result;
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

				return result;
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
};
