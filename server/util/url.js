'use strict';

module.exports = {
	mapArray: [
		// AFC
  	{name: 'Australia', url: 'australien-team'},
	  {name: 'Iran', url: 'iran-team'},
		{name: 'Japan', url: 'japan-team'},
		{name: 'Saudi Arabia', url: 'saudi-arabien-team'},
		{name: 'South Korea', url: 'suedkorea-team'},
		// UEFA
		{name: 'Belgium', url: 'belgien-team'},
		{name: 'Croatia', url: 'kroatien-team'},
		{name: 'Denmark', url: 'daenemark-team'},
		{name: 'England', url: 'england-team'},
		{name: 'France', url: 'frankreich-team'},
		{name: 'Germany', url: 'deutschland-team'},
		{name: 'Iceland', url: 'island-team'},
		{name: 'Poland', url: 'polen-team'},
		{name: 'Portugal', url: 'portugal-team'},
		{name: 'Russia', url: 'russland-team'},
		{name: 'Serbia', url: 'serbien-team'},
		{name: 'Spain', url: 'spanien-team'},
		{name: 'Sweden', url: 'schweden-team'},
		{name: 'Switzerland', url: 'schweiz-team'},
		// CONMEBOL
		{name: 'Argentina', url: 'argentinien-team'},
		{name: 'Brazil', url: 'brasilien-team'},
		{name: 'Colombia', url: 'kolumbien-team'},
		{name: 'Peru', url: 'peru-team'},
		{name: 'Uruguay', url: 'uruguay-team'},
		// CONCACAF
		{name: 'Costa Rica', url: 'costa-rica-team'},
		{name: 'Mexico', url: 'mexiko-team'},
		{name: 'Panama', url: 'panama-team'},
		// CAF
		{name: 'Egypt', url: 'aegypten-team'},
		{name: 'Morocco', url: 'marokko-team'},
		{name: 'Nigeria', url: 'nigeria-team'},
		{name: 'Tunisia', url: 'tunesien-team'},
		{name: 'Senegal', url: 'senegal-team'},
		// Club teams
		{name: '1. FC Kaiserslautern', url: '1-fc-kaiserslautern'},
		{name: '1. FC Nürnberg', url: '1-fc-nuernberg'},
		{name: 'AC Arles-Avignon', url: 'ac-arles-avignon'},
		{name: 'Cádiz CF', url: 'cadiz-cf'},
		{name: 'Évian Thonon Gaillard', url: 'evian-thonon-gaillard'},
		{name: 'FC Messina', url: 'acr-messina'},
		{name: 'FC St. Pauli', url: 'fc-st-pauli'},
		{name: 'Fortuna Düsseldorf', url: 'fortuna-duesseldorf'},
		{name: 'Gimnàstic', url: 'gimnastic'},
		{name: 'Le Mans UC 72', url: 'le-mans-fc'},
		{name: 'Reggina Calcio', url: 'reggina-1914'},
		{name: 'SpVgg Greuther Fürth', url: 'spvgg-greuther-fuerth'},
		{name: 'Treviso FBC', url: 'a-c-d-treviso'},
		{name: '', url: ''}
	],
	getUrlToNameMap: function() {
		var map = {};
		var i, entry;

		for (i = 0; i < this.mapArray.length; i++) {
			entry = this.mapArray[i];
			map[entry.url] = entry.name;
		}

		return map;
	},
	getNameToUrlMap: function() {
		var map = {};
		var i, entry;

		for (i = 0; i < this.mapArray.length; i++) {
			entry = this.mapArray[i];
			map[entry.name] = entry.url;
		}

		return map;
	},
	getTeamNameFromUrl: function(teamUrl) {
		var map = this.getUrlToNameMap();
		if (map[teamUrl]) {
			return map[teamUrl];
		}

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
		} else if (team === 'Sporting Gijon') {
			team = 'Sporting Gijón';
		} else if (team === 'UD Almeria') {
			team = 'UD Almería';
		} else if (team === 'Cordoba CF') {
			team = 'Córdoba CF';
		} else if (team === 'Hercules CF') {
			team = 'Hércules CF';
		}

		return team;
	},
	getUrlFromTeamName: function(team) {
		var map = this.getNameToUrlMap();
		if (map[team]) {
			return map[team];
		}

		var url = team;

		if (url === 'Brighton & Hove Albion') {
			url = 'Brighton Hove Albion';
		} else if (url === 'AS Saint-Étienne') {
			url = 'AS Saint Etienne';
		}

		url = url.replace(/ö/g, 'oe');
		url = url.replace(/ü/g, 'ue');
		url = url.replace(/á/g, 'a');
		url = url.replace(/é/g, 'e');
		url = url.replace(/ñ/g, 'n');
		url = url.replace(/ó/g, 'o');
		url = url.replace(/í/g, 'i');
		url = url.replace(/ /g, '-');
		url = url.replace(/\./g, '');

		return url;
	}
};
