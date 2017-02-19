'use strict';

const path = require('path');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(router, db) {

	router.get('/api/match/fetch/:_url', function(req, res) {
		const match_url = req.params._url;
		const Seasons = db.collection('Seasons');

		Seasons.find({'competitions.matches': {$elemMatch: {url: match_url}}}).toArray()
			.then(function(seasons) {
				if (seasons.length === 0) {
					res.sendStatus(204);
				} else {
					const season = seasons[0];
					var Promises = [];
					var competition, match;
					var i, j;
					var found = false;

					for (i in season.competitions) {
						competition = season.competitions[i];

						for (j in competition.matches) {
							match = competition.matches[j];

							if (match.url === match_url) {
								found = true;
								break;
							}
						}

						if (found) {
							break;
						}
					}

					if (!found) {
						res.sendStatus(204);
					} else {
						const execStr = 'perl ' + path.resolve('perl', 'mu_match.pl') + ' ' + match_url;

						exec(execStr, function(error, stdout, stderr) {
							const data = JSON.parse(stdout);
							match.summary = data;

							Seasons.update(
									{ _id: ObjectID(season._id), "competitions.name" : competition.name },
									{ $set: { "competitions.$.matches":  competition.matches } })
								.then(function(result) {
									res.sendStatus(200);
								});
						});
					}
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	});
};
