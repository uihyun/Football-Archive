'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Leagues = db.collection('Leagues');
  const Cups = db.collection('Cups');

	router.get('/api/history/team/:_teamUrl', function (req, res) {
    const team = UrlUtil.getTeamNameFromUrl(req.params._teamUrl);

		function getLeagueTable(season, name) {
			return Leagues.findOne({season: season, name: name})
				.then(function (league) {
					if (league === null) {
						return null;
					}

					var i, row;

					for (i = 0; i < league.table.length; i++) {
						row = league.table[i];

						if (row.name === team) {
							return { season: season, name: name, league: row };
						}
					}
				});
		}

		function getCup(season, name) {
			return Cups.findOne({season: season, name: name})
				.then(function (cup) {
					if (cup === null) {
						return null;
					}

					var i, round;
					var j, match;
					var matches = [];
					var cup;

					for (i = cup.rounds.length - 1; i > 0; i--) {
						round = cup.rounds[i];

						for (j = 0; j < round.matches.length; j++) {
							match = round.matches[j];

							if (match.l === team || match.r === team) {
								matches.push(match);
							}
						}

						if (matches.length > 0) {
							cup = { round: round.name, matches: matches, winner: cup.winner };

							if (round.table) {
								cup.table = round.table;
							}

							return { season: season, name: name, cup: cup };
						}
					}
				});
		}

    Seasons.find({team: team}).toArray()
      .then(function (seasons) {
				var promises = [];

				var i, season;
				var j, competition;

				for (i = 0; i < seasons.length; i++) {
					season = seasons[i];

					for (j = 0; j < season.competitions.length; j++) {
						competition = season.competitions[j];

						promises.push(getLeagueTable(season.season, competition.name));
						promises.push(getCup(season.season, competition.name));
					}
				}

				return Promise.all(promises);
			}).then(function (result) {
				var out = result.filter(r => { return r !== null; });
				res.json(out);
			});
	});
};
