'use strict';

module.exports = function(router, db) {
	router.get('/api/season/select/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const teamUrl = req.params._teamUrl;
		const team = teamUrl.replace(/-/g, ' ');
		const Seasons = db.collection('Seasons');
		const Matches = db.collection('Matches');

		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0)
					res.json({});
				else {
					var urls = [];
					var competition, match;
					var map = {};

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							urls.push(match.url);
							map[match.url] = match;
						}
					}

					Matches.find({url: {$in: urls}}).toArray()
						.then(function(matches) {
							var match;
							for (var i in matches) {
								match = matches[i];

								map[match.url].summary = match.summary;
							}
							res.json(seasons[0]);
						});
				}
			});
	});
	
	router.get('/api/season/select/:_season', function(req, res) {
		const season = req.params._season;
		const Seasons = db.collection('Seasons');
		
		Seasons.find({season: season}, {_id: 0, team: 1}).toArray()
			.then(function(seasons) {
				res.json(seasons.length > 0 ? seasons : {});
			});
	});
};
