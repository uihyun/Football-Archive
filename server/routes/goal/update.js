'use strict';

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');
  const Goals = db.collection('Goals');

	function getData(season) {
		var seasons, matches, urlMap = {};
		return Seasons.find({season: season}).toArray()
			.then(function (data) {
				seasons = data;

				var i, j, k;
				var season, competition, match;

				for (i in seasons) {
					season = seasons[i];

					for (j in season.competitions) {
						competition = season.competitions[j];

						for (k in competition.matches) {
							match = competition.matches[k];

							urlMap[match.url] = match;
						}
					}
				}
				
				var urls = [];
				for (i in urlMap) {
					urls.push(i);
				}
				
				var proj = {_id: 0, 'summary.l': 1, 'summary.r': 1, 'summary.goals': 1};
				return Matches.find({url: {$in: urls}}, proj).toArray();
			})
			.then(function (data) {
				matches = data;

				var urlMap = {};
				var i, match;
				for (i in matches) {
					match = matches[i];

					urlMap[match.url] = match;
				}

				return { seasons: seasons, urlMap: urlMap };
			});
	}

	function getLeagues(season) {
		return Leagues.find({season: season}, {_id: 0, name: 1}).toArray()
			.then(function (data) {
				var array = ['World Cup'];

				for (var i in data) {
					array.push(data[i].name);
				}

				return array;
			});
	}

	function initPlayer(map, name) {
		if (map[name] === undefined) {
			map[name] = {name: name, seasonGoals: 0, leagueGoals: 0};
		}
		
		return map[name];
	}

	function getSide(season, summary) {
		return (summary.l === season.team) ? 'l' : 'r';
		
	}
	
	router.get('/api/goal/update-all/:_season/', function(req, res) {
		const year = req.params._season;
		var leagues, seasons, matches;

		var promises = [getData(year), getLeagues(year)];

		Promise.all(promises)
		.then(async function (array) {
			const seasons = array[0].seasons;
			const urlMap = array[0].urlMap;
			const leagueNames = array[1];

			var i;
			var leagues = {};
			var leagueName;

			for (i in leagueNames) {
				leagueName = leagueNames[i];
				leagues[leagueName] = {season: year, name: leagueName, teams: [], goals: []};
			}
			
			var j, season, competition, match;

			for (i in seasons) {
				season = seasons[i];

				for (j in season.competitions) {
					competition = season.competitions[j];

					if (leagues[competition.name]) {
						leagues[competition.name].teams.push(season);
						break;
					}
				}
			}

			var k, l, m, league, match, goal, scorers, isLeague, summary, side, player;

			for (l in leagues) {
				league = leagues[l];
				for (i in league.teams) {
					season = league.teams[i];
					scorers = {};

					for (j in season.competitions) {
						competition = season.competitions[j];

						isLeague = competition.name === league.name;
							
						for (k in competition.matches) {
							match = competition.matches[k];

							if (urlMap[match.url] === undefined ||
									urlMap[match.url].summary === undefined)
								continue;

							summary = urlMap[match.url].summary;
							side = getSide(season, summary);

							for (m in summary.goals) {
								goal = summary.goals[m];

								if (goal.side === side && goal.style !== 'own goal') {
									player = initPlayer(scorers, goal.scorer);
									player.seasonGoals++;

									if (isLeague) {
										player.leagueGoals++;
									}
								}
							}
						}
					}

					for (j in scorers) {
						player = scorers[j];
						player.team = season.team;
						league.goals.push(player);
					}
				}
			}

			var bulk = Goals.initializeUnorderedBulkOp();

			for (l in leagues) {
				league = leagues[l];
				if (league.goals.length > 0) {
					bulk.find({ season: league.season, name: league.name }).upsert().update({ $set: { goals: league.goals }});
				}
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
