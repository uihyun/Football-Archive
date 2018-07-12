'use strict';

const Promise = require('bluebird');

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Leagues = db.collection('Leagues');
	const Cups = db.collection('Cups');
	const Goals = db.collection('Goals');

	router.get('/api/competition/select/:_season/:_compUrl', function(req, res) {
		const season = req.params._season;
		const comp = UrlUtil.getNameFromUrl(req.params._compUrl);
		var result = {name: comp};

		function getLeague() {
			return Leagues.findOne({season: season, name: comp})
				.then(function(league)	{
					result.league = league;
				});
		}

		function getCup() {
			return Cups.findOne({season: season, name: comp}, {teams: 0})
				.then(function(cup)	{
					result.cup = cup;
				});
		}

		function getGoals() {
			return Goals.findOne({season: season, name: comp}, {teams: 0})
				.then(function(goals)	{
					if (goals !== null) {
						result.goals = goals.goals;
					}
				});
		}

		var promises = [getLeague(), getCup(), getGoals()];

		Promise.all(promises)
			.then(function() {
				res.json(result);
			});
	});
};
