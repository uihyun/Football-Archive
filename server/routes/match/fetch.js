'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const http = require('http');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');

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

	function fetchMatchUrl(url) {
		if (url === '')
			return;

		if (url.match(/^KL/))
			return getKLeagueMatch(url);

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
