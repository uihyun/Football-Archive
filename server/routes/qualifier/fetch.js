'use strict';

const CupUtil = require('../../util/cup');
const QualUtil = require('../../util/qualifier');

module.exports = function(router, db) {
  const Seasons = db.collection('Seasons');
  const Qualifiers = db.collection('Qualifiers');

	function getSeasonArray(qual) {
		var seasonMap = {};
		var seasons = [];

		qual.rounds.forEach(round => {
			round.matches.forEach(match => {
				var year = match.date.substring(6, 10);
				if (seasonMap[year] === undefined) {
					seasonMap[year] = true;
					seasons.push(year);
				}
			});
		});

		seasons.sort();
		return seasons;
	}

	function fetchQual(qual) {
		CupUtil.fetch(qual)
		.then(function(qual) {
			qual.season = getSeasonArray(qual);
			return Qualifiers.findOneAndReplace({url: qual.url, name: qual.name}, qual, {upsert: true});
		}).catch(function (error) {
			console.log(qual.url);
			console.log(error);
			throw(error);
		});
	}

	function getQuals(season) {
		return Qualifiers.find({season: season}).toArray();
	}
	
	function getSeasons(season) {
		return Seasons.find({season: season}).toArray();
	}

	function getQualMap(seasons) {
		var quals = {};
		var season;
		var competition, qual, url;
		var i, j, k;
		var promises = [];

		for (i in seasons) {
			season = seasons[i];

			for (j in season.competitions) {
				competition = season.competitions[j];

				if (QualUtil.isValid(competition.name) == false) {
					continue;
				}

				url = competition.url;

				if (quals[competition.name] === undefined) {
					quals[competition.name] = {
						name: competition.name,
						url: url,
						teamMap: {}
					};
				}

				quals[competition.name].teamMap[season.team] = true;
			}
		}

		return quals;
	}

	function fetchQuals(season) {
		var quals = {};

		return getSeasons(season)
		.then(function(seasons) {
			var promises = [];
			var i, qual;
			quals = getQualMap(seasons);

			for (i in quals) {
				qual = quals[i];
				promises.push(fetchQual(qual));
			}

			return Promise.all(promises);
		});
	}

	router.get('/api/qual/fetch/:_season/', function(req, res) {
    const season = req.params._season;
			
		fetchQuals(season)
		.then(_ => {
			res.sendStatus(200);
		});
	});
};
