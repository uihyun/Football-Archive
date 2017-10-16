'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	
	router.get('/api/versus/select/:_teamA/:_teamB', function(req, res) {
		const teamA = UrlUtil.getTeamNameFromUrl(req.params._teamA);
		const teamB = UrlUtil.getTeamNameFromUrl(req.params._teamB);

		var out = {};

		function getMatches(teamA, teamB, out) {
			const query = {$or: [{'summary.l': teamA, 'summary.r': teamB},
													 {'summary.l': teamB, 'summary.r': teamA}]};

			return Matches.find(query).toArray()
				.then(function(matches) {
					out.matches = matches;
				});
		}

		function getSeasons(teamA, teamB, out) {
			const query = {team: {$in: [teamA, teamB]}};

			return Seasons.find(query).toArray()
				.then(function(seasons) {
					out.seasons = seasons;
				});
		}

		var promises = [getMatches(teamA, teamB, out), getSeasons(teamA, teamB, out)];

		Promise.all(promises).then(function () {
			var matchMap = {};
			var match;
			var i;

			for (i in out.matches) {
				match = out.matches[i];
				matchMap[match.url] = match;
			}

			var season, comp;
			var j, k;

			for (i in out.seasons) {
				season = out.seasons[i];

				for (j in season.competitions) {
					comp = season.competitions[j];

					for (k in comp.matches) {
						match = comp.matches[k];

						if (matchMap[match.url] !== undefined) {
							matchMap[match.url].season = season.season;
							matchMap[match.url].competition = comp.name;
							matchMap[match.url].round = match.round;
							matchMap[match.url].date = match.date;
						}
					}
				}
			}

			res.json(out.matches);
		});
	});
};
