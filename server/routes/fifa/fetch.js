'use strict';

const path = require('path');
const exec = require('../../util/exec');

const monthMap = {
	"January": 1,
	"February": 2,
	"March": 3,
	"April": 4,
	"May": 5,
	"June": 6,
	"July": 7,
	"August": 8,
	"September": 9,
	"October": 10,
	"November": 11,
	"December": 12
};

module.exports = function(router, db) {
	const FIFARankings = db.collection('FIFARankings');

	function fetch(id) {
		var execStr = 'perl ' + path.join(__dirname, '../../../perl', 'fifa.pl');

		if (id)
			execStr += ' ' + id;

		return exec(execStr)
		.then(function (data) {
			var dateArray = data.date.split(' ');
			var month = monthMap[dateArray[1]];
			var year = dateArray[2];
			var date = month + '-' + dateArray[0] + '-' + year;

			data.year = year;
			data.date = date;

			return FIFARankings.findOneAndReplace({id: data.id}, data, {upsert: true});
		})
	}

	router.get('/api/fifa/fetch', function (req, res) {
		fetch()
		.then(function () {
			res.sendStatus(200);
		});
	});
	
	router.get('/api/fifa/fetch/:_id', function (req, res) {
		fetch(req.params._id)
		.then(function () {
			res.sendStatus(200);
		});
	});
};
