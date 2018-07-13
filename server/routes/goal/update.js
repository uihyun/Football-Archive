'use strict';

const KLeagueUtil = require('../../util/kleague');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const Leagues = db.collection('Leagues');
  const Goals = db.collection('Goals');
	const aclTeams = KLeagueUtil.aclReverseMap;

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

	function normalizeACLNames(season, acl, urlMap) {
		const team = season.team;
		var league;
		var j, competition;
					
		for (j in season.competitions) {
			competition = season.competitions[j];

			if (competition.name === 'K League 1') {
				league = competition;
				break;
			}
		}

		if (league === undefined || acl === undefined)
			return;

		var numberMap = {};
		var j, k, match, summary, side, players, player, length;

		for (j = 0; j < league.matches.length; j++) {
			match = league.matches[j];
			
			if (urlMap[match.url] === undefined ||
					urlMap[match.url].summary === undefined)
				continue;

			summary = urlMap[match.url].summary;

			if (summary.players === undefined)
				continue;

			side = (summary.r === team) ? 'r' : 'l';
			players = summary.players[side];

			for (k = 0; k < players.start.length; k++) {
				player = players.start[k];
				numberMap[player.number] = player.name;
			}

			length = players.sub ? players.sub.length : 0;
			for (k = 0; k < length; k++) {
				player = players.sub[k];
				numberMap[player.number] = player.name;
			}	
		}

		var replaceMap, goal;
		
		for (j = 0; j < acl.matches.length; j++) {
			match = acl.matches[j];
			
			if (urlMap[match.url] === undefined ||
					urlMap[match.url].summary === undefined)
				continue;

			summary = urlMap[match.url].summary;
			replaceMap = {};

			if (summary.players === undefined)
				continue;

			side = (summary.r === team) ? 'r' : 'l';
			players = summary.players[side];

			for (k = 0; k < players.start.length; k++) {
				player = players.start[k];

				if (numberMap[player.number]) {
					replaceMap[player.name] = numberMap[player.number];
					player.name = numberMap[player.number];
				}
			}

			length = players.sub ? players.sub.length : 0;
			for (k = 0; k < length; k++) {
				player = players.sub[k];

				if (numberMap[player.number]) {
					replaceMap[player.name] = numberMap[player.number];
					player.name = numberMap[player.number];
				}
			}

			for (k = 0; k < summary.goals.length; k++) {
				goal = summary.goals[k];

				if (replaceMap[goal.scorer])
					goal.scorer = replaceMap[goal.scorer];

				if (replaceMap[goal.assist])
					goal.assist = replaceMap[goal.assist];
			}
		}
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

						if (competition.name === 'AFC Champions League' && aclTeams[season.team])
							normalizeACLNames(season, competition, urlMap);
							
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
