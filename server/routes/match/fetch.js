'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const http = require('http');

const KLeagueUtil = require('../../util/kleague');
const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	const teamNameMap = KLeagueUtil.cupTeamNameMap;

	function promiseFromChildProcess(child) {
		return new Promise(function (resolve, reject) {
			child.addListener("error", reject);
			child.addListener("exit", resolve);
		});
	}

	function get(url) {

		return new Promise(function (resolve, reject) {
			http.get(url, (resp) => {
				let data = '';
				resp.setEncoding('utf8');
				resp.on('data', (chunk) => { data += chunk; });
				resp.on('end', () => { resolve(JSON.parse(data)); });
			}).on("error", (err) => {
				reject(err);
			});
		});
	}

	function formatMatch(data) {
		var match = {
			goals: [],
			players: {
				l: { start: [], sub: [] },
				r: { start: [], sub: [] }
			}
		};

		match.l = data.gameInfo.hName;
		match.r = data.gameInfo.aName;

		function getMinute(time) {
			var minute = parseInt(time.substring(0, 2), 10);

			if (parseInt(time.substring(3, 5), 10) > 0)
				minute++;

			return minute;
		}

		function getGoal(raw, side) {
			var goal = { side: side, scorer: raw.pName.replace(/ (.*)/, '') };
			goal.minute = getMinute(raw.gTime);

			if (raw.own === 'Y')
				goal.style = 'own goal';

			return goal;
		}

		function getCard(raw, cardMap) {
			if (raw.type === 'yellow') {
				cardMap[raw.pName] = { type: raw.type, minute: getMinute(raw.time) };
			}

			if (raw.type === 'red') {
				if (cardMap[raw.pName]) {
					cardMap[raw.pName] = { type: 'Second yellow', minute: getMinute(raw.time) };
				} else {
					cardMap[raw.pName] = { type: raw.type, minute: getMinute(raw.time) };
				}
			}
		}

		function getPlayer(match, side, raw, cardMap) {
			var player = { number: raw.shirtNumber, name: raw.pName };

			if (cardMap[player.name])
				player.card = cardMap[player.name];

			if (raw.as !== '0')
				player.assist = parseInt(raw.as, 10);

			if (raw.posOrder === '-1') {
				match.players[side].sub.push(player);
			} else if (raw.sType === 'in') {
				player.sub = parseInt(raw.sTime, 10);
				match.players[side].sub.push(player);
			} else if (raw.sType === 'out') {
				if (!(raw.rc === '1' || raw.yc === '2')) {
					player.sub = parseInt(raw.sTime, 10);
				}
				match.players[side].start.push(player);
			} else {
				match.players[side].start.push(player);
			}
		}

		const goals = data.goalInfo;
		var i;

		for (i = 0; i < goals.home.length; i++) {
			match.goals.push(getGoal(goals.home[i], 'l'));
		}

		for (i = 0; i < goals.away.length; i++) {
			match.goals.push(getGoal(goals.away[i], 'r'));
		}

		match.goals.sort((a, b) => { return a.minute - b.minute });

		var cardMap = {};
		for (i = 0; i < data.scoreBoard.rt.home.length; i++) {
			getCard(data.scoreBoard.rt.home[i], cardMap);
		}
		
		for (i = 0; i < data.scoreBoard.rt.away.length; i++) {
			getCard(data.scoreBoard.rt.away[i], cardMap);
		}

		const lineup = data.lineup;
		for (i = 0; i < lineup.home.length; i++) {
			getPlayer(match, 'l', lineup.home[i], cardMap);
		}
		
		for (i = 0; i < lineup.away.length; i++) {
			getPlayer(match, 'r', lineup.away[i], cardMap);
		}

		return match;
	}
	
	function getKLeagueMatch(url) {
		var league = 'kleague';

		if (url.match(/^KLL/))
			league += 2;

		var uri = url.replace(/^KL/, '').replace(/^L/, '');
		var year = uri.substring(0, 4);
		var month = uri.substring(4, 6);
		var matchUrl = 'http://sportsdata.pstatic.net/ndata/' + league + '/';
		matchUrl += year + '/';
		matchUrl += month + '/';
		matchUrl += uri + '.json';

		return get(matchUrl).then(data => { return formatMatch(data) })
		.then(summary => {
			return Matches.insert({ url: url, summary: summary });
		});
	}

	function formatKFACupMatch(data) {
		var match = {
			goals: [],
			players: {
				l: { start: [], sub: [] },
				r: { start: [], sub: [] }
			}
		};

		var assistMap = [];

		match.l = data.l;
		match.r = data.r;

		if (teamNameMap[match.l])
			match.l = teamNameMap[match.l];

		if (teamNameMap[match.r])
			match.r = teamNameMap[match.r];

		if (data.aet === true)
			match.aet = true;

		if (data.pso)
			match.pso = data.pso;

		const sides = ['l', 'r'];
		var i, side;
		var j, og, goal;

		for (i = 0; i < sides.length; i++) {
			side = sides[1 - i];

			for (j = 0; j < data.og[i].length; j++) {
				og = data.og[i];
				goal = { side: side, scorer: og.name, minute: og.minute, style: 'own goal' };
				match.goals.push(goal);
			}
		}

		function getCard(row, player) {
			var cards;

			if (row.yellows) {
				cards = row.yellows.split(',');
				if (cards.length === 2) {
					player.card = { type: 'Second yellow', minute: cards[1] };
				} else {
					player.card = { type: 'yellow', minute: cards[0] };
				}
			}

			if (row.reds) {
				if (player.card === undefined || player.card.type !== 'Second yellow') {
					player.card = { type: 'red', minute: row.reds };
				}
			}
		}

		function addGoal(row, player, side) {
			if (row.goals === undefined)
				return;

			var goals = row.goals.split(',');
			var i, minute;

			for (i = 0; i < goals.length; i++) {
				minute = goals[i];

				match.goals.push({ side: side, scorer: player.name, minute: minute });
			}
		}

		function addAssist(row, player) {
			if (row.assists === undefined)
				return;

			var assists = row.assists.split(',');
			var i, minute;

			for (i = 0; i < assists.length; i++) {
				minute = assists[i];

				assistMap[minute] = player.name;
			}
		}
		
		var row, player;

		for (i = 0; i < sides.length; i++) {
			side = sides[i];

			for (j = 0; j < data.starting[i].length; j++) {
				row = data.starting[i][j];
				player = { number: row.number, name: row.name };
				getCard(row, player);
				addGoal(row, player, side);
				addAssist(row, player);

				match.players[side].start.push(player);
			}
		}

		for (i = 0; i < sides.length; i++) {
			side = sides[i];

			for (j = 0; j < data.bench[i].length; j++) {
				row = data.bench[i][j];
				player = { number: row.number, name: row.name };
				getCard(row, player);
				addGoal(row, player, side);
				addAssist(row, player);

				match.players[side].sub.push(player);
			}
		}

		for (i = 0; i < match.goals.length; i++) {
			goal = match.goals[i];

			if (goal.style !== undefined)
				continue;

			if (assistMap[goal.minute])
				goal.assist = assistMap[goal.minute];
		}

		match.goals.sort((a, b) => { return a.minute - b.minute; });

		return match;
	}

	function getKFACupMatch(url) {
		const uri = url.replace(/^KFACUP/, '').replace(/=/g, '%3D').replace(/&/, '%26');
		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'kfacup_match.pl') + ' ' + uri;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

				const data = JSON.parse(stdout);
				const summary = formatKFACupMatch(data);
				
				return Matches.insert({ url: url, summary: summary });
			});
	}

	function fetchMatchUrl(url) {
		if (url === '')
			return;

		if (url.match(/^KL/))
			return getKLeagueMatch(url);
		
		if (url.match(/^KFACUP/))
			return getKFACupMatch(url);

		const execStr = 'perl ' + path.join(__dirname, '../../../perl', 'match.pl') + ' ' + url;

		var stdout = '';
		var child = exec(execStr);
		child.stdout.on('data', function(chunk) {stdout += chunk});

		return promiseFromChildProcess(child)
			.then(function () {
				if (stdout === '')
					return;

				const data = JSON.parse(stdout);
				const newMatch = {
					url: url,
					summary: data
				};

				return Matches.insert(newMatch);
			}).catch(function (error) {
				console.log(execStr);
				throw(error);
			});
	}

	function fetchThenRespond(res, urls) {
		Matches.find({url: {$in: urls}}, {_id: 0, url: 1}).toArray()
			.then(function(matches) {
				var fetchUrls = [];
				var urlMap = {};
				var i, url;

				for (var i in matches) {
					urlMap[matches[i].url] = true;
				}

				for (var i in urls) {
					url = urls[i];
					if (urlMap[url] === undefined) {
						fetchUrls.push(url);
					}
				}

				Promise.map(fetchUrls, function (url) {
					return fetchMatchUrl(url);
				}, {concurrency: 8})
				.then(function () {
					res.sendStatus(200);
				});
			});
	}
	
	router.get('/api/match/fetch-season/:_season', function(req, res) {
		const season = req.params._season;
		
		Seasons.find({season: season}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var season, competition, match;
					var matchDate;
					var i, j, k;
					var urlMap = {};

					for (i in seasons) {
						season = seasons[i];

						for (j in season.competitions) {
							competition = season.competitions[j];

							for (k in competition.matches) {
								match = competition.matches[k];
								matchDate = new Date(match.date);

								if (matchDate < new Date()) {
									urlMap[match.url] = match.url;
								}
							}
						}
					}

					var urls = [];
					for (i in urlMap) {
						urls.push(i);
					}

					fetchThenRespond(res, urls);	
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
