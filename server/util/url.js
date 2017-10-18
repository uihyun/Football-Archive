'use strict';

module.exports = {
	getTeamNameFromUrl: function(teamUrl) {
		var team = teamUrl.replace(/-/g, ' ');

		if (team === 'Brighton Hove Albion') {
			team = 'Brighton & Hove Albion';
		} else if (team === 'Atletico Madrid') {
			team = 'Atlético Madrid';
		} else if (team === 'CD Alaves') {
			team = 'CD Alavés';
		} else if (team === 'Malaga CF') {
			team = 'Málaga CF';
		} else if (team === 'Deportivo La Coruna') {
			team = 'Deportivo La Coruña';
		} else if (team === 'CD Leganes') {
			team = 'CD Leganés';
		}

		return team;
	},
	getUrlFromTeamName: function(team) {
		var url = team;

		if (url === 'Brighton & Hove Albion') {
			url = 'Brighton Hove Albion';
		} else if (url === 'Atlético Madrid') {
			url = 'Atletico Madrid';
		} else if (url === 'CD Alavés') {
			url = 'CD Alaves';
		} else if (url === 'Málaga CF') {
			url = 'Malaga CF';
		} else if (url === 'Deportivo La Coruña') {
			url = 'Deportivo La Coruna';
		} else if (url === 'CD Leganés') {
			url = 'CD Leganes';
		}

		url = url.replace(/ /g, '-');

		return url;
	}
};
