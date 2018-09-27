'use strict';

const Promise = require('bluebird');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');
	const FIFARankings = db.collection('FIFARankings');
	
	router.get('/api/match/recent', function(req, res) {
		var matchMap = {};
		var now = new Date();
		var tomorrow = new Date(now.getTime() + (1 * 24 * 60 * 60 * 1000));
		var weekBefore = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
		var matchDate;
		
		Seasons.find({done: { $ne: true }}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var i, j, k;
					var season, comp, match, teams;
					var matchUrl;
					var compMap = {};

					for (i in seasons) {
						season = seasons[i];

						for (j in season.competitions) {
							comp = season.competitions[j];
							compMap[comp.name] = season.season;

							for (k in comp.matches) {
								match = comp.matches[k];
								matchDate = new Date(match.date);

								if (matchDate >= weekBefore && matchDate <= tomorrow) {
									matchUrl = (match.url !== undefined) ? match.url : (season.team + match.date);
									teams = (match.place === 'A') ? [match.vs, season.team] : [season.team, match.vs];
									matchMap[matchUrl] = {
										competition: comp.name,
										season: season.season,
										round: match.round,
										date: match.date,
										teams: teams,
										url: match.url,
									};
								}
							}
						}
					}

					var matches = [];
					for (i in matchMap) {
						matches.push(i);
					}

					var competitions = [];
					for (i in compMap) {
						competitions.push({ name: i, season: compMap[i] });
					}

					var promises = [];

					promises.push(Matches.find({url: {$in: matches}}).toArray());
					promises.push(Leagues.find({ $or: competitions }).toArray());
					promises.push(FIFARankings.find({}).sort({id: -1}).limit(1).toArray());

					Promise.all(promises)
					.then(function([matches, leagues, fifa]) {
						var i, match;

						for (i in matches) {
							match = matches[i];
							matchMap[match.url].summary = match.summary;
						}

						var result = [];
						for (i in matchMap) {
							result.push(matchMap[i]);
						}

						var teamMap = {};
						leagues.forEach(league => {
							league.table.forEach(row => {
								teamMap[row.name] = row.rank;
							});
						});

						res.json({ matches: result, teamRanks: teamMap, fifaRanking: fifa[0] });
					});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
