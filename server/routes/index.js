'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');

var router = express.Router();

var Promise = require('bluebird');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var assert = require('assert');
var url = 'mongodb://football:football@ds259079.mlab.com:59079/football-archive';
var dbname = 'football-archive';

Promise.promisifyAll(mongodb);

var addRoutes = function(dir, db) {
	fs.readdirSync(dir)
		.filter(function(file) {
			return (file.indexOf('.') !== 0);
		})
		.forEach(function(file) {
			require(path.join(dir, file))(router, db);
		});
};

var addDirs = function(db) {
	fs.readdirSync(__dirname)
		.filter(function(dir) {
			const dirPath = path.join(__dirname, dir);
			return fs.lstatSync(dirPath).isDirectory();
		})
		.forEach(function(dir) {
			const dirPath = path.join(__dirname, dir);
			addRoutes(dirPath, db);
		});
};

MongoClient.connect(url, function(err, client) {
	assert.equal(null, err);
	console.log("Connected succesfully to mongoDB server");

	const db = client.db(dbname);
	addDirs(db);

	// For all other routes return the main index.html, so react-router render the route in the client
	router.get('*', (req, res) => {
		res.sendFile(path.resolve('../build', 'index.html'));
	});
});

module.exports = router;
