'use strict';

const http = require('http');

module.exports = function(router, db) {
	const KLeague = db.collection('KLeague');

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

	function getGames(data) {
		const schedule = data.dailyScheduleListMap;
		var date, formattedDate, uri, index, match;
		var games = [];

		for (date in schedule) {
			formattedDate = date.substring(4, 6) + '/' + date.substring(6, 8) + '/' + date.substring(0, 4);
			
			for (index in schedule[date]) {
				match = schedule[date][index];
				uri = match.textRelayURI.replace(/^.*gameId=/, '');
				games.push({
					date: formattedDate,
					home: match.homeTeamName,
					away: match.awayTeamName,
					state: match.state,
					round: match.gameContent,
					uri: uri,
				});
			}
		}

		return games;
	}

	function getMonth(url, month) {
		var monthUrl = url + (month < 10 ? '0' : '') + month;

		return get(monthUrl)
		.then(function (data) {
			if (parseInt(data.month, 10) === month) {
				return getGames(data);
			} else {
				return null;
			}
		});
	}

	router.get('/api/korea/league/update/:_season/:_league', function(req, res) {
		const season = req.params._season;
		const leagueName = req.params._league;

		var url = 'http://sports.news.naver.com/kfootball/schedule/monthlySchedule.nhn?';
		url += 'category=' + leagueName;
		url += '&year=' + season;
		url += '&month=';

		var month;
		var promises = [];

		for (month = 1; month <= 12; month++) {
			promises.push(getMonth(url, month));
		}

		Promise.all(promises)
		.then(function (months) {
			var games = [];
			months.forEach(month => { if (month !== null) { games = games.concat(month); } });
			var entry = { season: season, name: leagueName, games: games };
			return KLeague.findOneAndReplace({ season: season, name: leagueName }, entry, { upsert: true });
		}).then(_ => { res.sendStatus(200); });
	});
};
