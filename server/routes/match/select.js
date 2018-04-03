'use strict';

const Promise = require('bluebird');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Matches = db.collection('Matches');

	router.get('/api/match/select/:_url', function (req, res) {
		const url = req.params._url;
			
		function getMatch(result) {
			return Matches.findOne({url: url})
				.then(function(match) {
					result.summary = match.summary;
				});
		}

		function getSeason(result) {
			return Seasons.findOne({'competitions.matches.url': url})
				.then(function(season) {
					var i, comp;
					var j, match;

					for (i in season.competitions) {
						comp = season.competitions[i];

						for (j in comp.matches) {
							match = comp.matches[j];

							if (match.url === url) {
								result.competition = comp.name;
								result.round = match.round;
								result.date = match.date;
								return;
							}
						}
					}
				});
		}

		var result = {};
		var promises = [];
		promises.push(getMatch(result));
		promises.push(getSeason(result));

		Promise.all(promises)
		.then(function() {
			res.json(result);
		});
	});
};
