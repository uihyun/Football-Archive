'use strict';

module.exports = {
	getTeamNameFromUrl: function(teamUrl) {
		var team = teamUrl.replace(/-/g, ' ');

		if (team === 'Brighton Hove Albion') {
			team = 'Brighton & Hove Albion';
		}

		return team;
	}
};
