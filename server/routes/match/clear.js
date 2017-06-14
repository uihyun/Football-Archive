'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

const UrlUtil = require('../../util/url');

module.exports = function(router, db) {
	const Seasons = db.collection('Seasons');
	const Matches = db.collection('Matches');
	
	router.get('/api/match/clear/:_season/:_teamUrl', function(req, res) {
		const season = req.params._season;
		const team = UrlUtil.getTeamNameFromUrl(req.params._teamUrl);
		
		Seasons.find({season: season, team: team}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					var promises = [];
					var competition, match;
					var matchDate;
					var urls = [];

					for (var i in seasons[0].competitions) {
						competition = seasons[0].competitions[i];
					
						for (var j in competition.matches) {
							match = competition.matches[j];
							urls.push(match.url);
						}
					}

					Matches.remove({url: {$in: urls}})
						.then(function() {
							res.sendStatus(200);
						});
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});

};
