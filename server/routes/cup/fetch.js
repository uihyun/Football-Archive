'use strict';

const CupUtil = require('../../util/cup');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Cups = db.collection('Cups');

	function fetchCup(cup) {
		CupUtil.fetch(cup)
		.then(function(cup) {
			return Cups.findOneAndReplace({season: cup.season, name: cup.name}, cup, {upsert: true});
		}).catch(function (error) {
			console.log(cup.url);
			console.log(error);
			throw(error);
		});
	}

	function getCups(season) {
		return Cups.find({season: season}).toArray();
	}
	
	function getSeasons(season) {
		return Seasons.find({season: season}).toArray();
	}

	function getCupMap(seasons) {
		var cups = {};
		var season;
		var competition, cup;
		var match, round;
		var i, j, k;
		var promises = [];

		for (i in seasons) {
			season = seasons[i];

			for (j in season.competitions) {
				competition = season.competitions[j];

				if (CupUtil.isValid(competition.name) == false) {
					continue;
				}

				if (cups[competition.name] === undefined) {
					cups[competition.name] = {
						season: season.season,
						name: competition.name,
						url: competition.url,
						teamMap: {}
					};
				}

				cups[competition.name].teamMap[season.team] = true;
			}
		}

		return cups;
	}

	function fetchCups(season) {
		var cups = {};

		return getSeasons(season)
		.then(function(seasons) {
			var promises = [];
			var i, cup;
			cups = getCupMap(seasons);

			for (i in cups) {
				cup = cups[i];
				promises.push(fetchCup(cup));
			}

			return Promise.all(promises);
		});
	}

	router.get('/api/cup/fetch/old/', function(req, res) {
		const oldCups = CupUtil.oldCups;
		var promises = [];
		var i, cup;
		
		for (i = 0; i < oldCups.length; i++) {
			cup = oldCups[i];
			cup.teamMap = {};
			promises.push(fetchCup(cup));
		}

		Promise.all(promises)
		.then(_ => {
			res.sendStatus(200);
		});
	});
	
	router.get('/api/cup/fetch/ongoing/:_season/', function(req, res) {
    const season = req.params._season;
		var promises = [getCups(season), getSeasons(season)];

		Promise.all(promises)
		.then(function ([cups, seasons]) {
			var map = getCupMap(seasons);
			var promises = [];
			var i, cup;

			for (i = 0; i < cups.length; i++) {
				cup = cups[i];

				if (cup.winner !== undefined)
					continue;

				if (cup.name === 'KFA Cup')
					continue;

				promises.push(fetchCup(map[cup.name]));
			}

			return Promise.all(promises);
		}).then(_ => {
			res.sendStatus(200);
		});
	});

	router.get('/api/cup/fetch/:_season/', function(req, res) {
    const season = req.params._season;
			
		fetchCups(season)
		.then(_ => {
			res.sendStatus(200);
		});
	});
};
