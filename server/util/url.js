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
		} else if (team === '1 FC Koeln') {
			team = '1. FC Köln';
		} else if (team === 'Bayern Muenchen') {
			team = 'Bayern München';
		} else if (team === 'Bor Moenchengladbach') {
			team = 'Bor. Mönchengladbach';
		} else if (team === '1 FSV Mainz 05') {
			team = '1. FSV Mainz 05';
		} else if (team === 'Paris Saint Germain') {
			team = 'Paris Saint-Germain';
		} else if (team === 'AS Saint Etienne') {
			team = 'AS Saint-Étienne';
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
		} else if (url === '1. FC Köln') {
			url = '1 FC Koeln';
		} else if (url === '1. FSV Mainz 05') {
			url = '1 FSV Mainz 05';
		} else if (url === 'AS Saint-Étienne') {
			url = 'AS Saint Etienne';
		}

		url = url.replace(/ö/g, 'oe');
		url = url.replace(/ü/g, 'ue');
		url = url.replace(/ /g, '-');

		return url;
	}
};
