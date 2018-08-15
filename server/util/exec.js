'use strict';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

module.exports = function(execStr) {
	return new Promise(async function (resolve, reject) {
		const { stdout, stderr } = await exec(execStr);

		var data;

		if (stdout === '') {
			resolve('');
			return;
		}

		try {
			data = JSON.parse(stdout);
		} catch(err) {
			console.log(stdout);
			console.log(err);
			reject();
		}

		resolve(data);
	});
};
