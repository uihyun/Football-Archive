'use strict';

module.exports = {
	getTeamNameFromUrl: function(teamUrl) {
		var team = teamUrl.replace(/-/g, ' ');

		if (team === 'Brighton Hove Albion') {
			team = 'Brighton & Hove Albion';
		}

		return team;
	},
	getUrlFromTeamName: function(team) {
		var url = team.replace(/ /g, '-');

		if (url === 'Brighton-&-Hove-Albion') {
			url = 'Brighton-Hove-Albion';
		}

		return url;
	}
};
