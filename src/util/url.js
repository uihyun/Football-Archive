import {teams, clubs} from '../data';

export default class UrlUtil {
	static getTeamUrl(team) {
		team = team.replace(/á/g, 'a');
		team = team.replace(/é/g, 'e');
		team = team.replace(/É/g, 'E');
		team = team.replace(/ñ/g, 'n');
		team = team.replace(/ö/g, 'oe');
		team = team.replace(/ü/g, 'ue');
		team = team.replace(/ó/g, 'o');
		team = team.replace(/í/g, 'i');
		team = team.replace(/\./g, '');
		return team.replace(/ & | /g, '-');
	}
	
	static getRecentMatchesUrl(season) {
		return '/api/match/recent/' + season;
	}

	static getSeasonSelectUrl(season, team) {
		return '/api/season/select/' + season + '/' + this.getTeamUrl(team);
	}

	static getSeasonFetchUrl(season, team) {
		return '/api/season/fetch/' + season + '/' + this.getTeamUrl(team);
	}

	static getSeasonClearUrl(season, team) {
		return '/api/season/clear/' + season + '/' + this.getTeamUrl(team);
	}

	static getMatchFetchUrl(season, team) {
		return '/api/match/fetch/' + season + '/' + this.getTeamUrl(team);
	}

	static getMatchClearUrl(season, team) {
		return '/api/match/clear/' + season + '/' + this.getTeamUrl(team);
	}
	
	static getVersusSelectUrl(teamA, teamB) {
		return '/api/versus/select/' + teamA + '/' + teamB;
	}
	
	static getMatchSelectUrl(url) {
		return '/api/match/select/' + url;
	}

	static getEmblemUrl(team) {
		var logoID = 2608043;

		if (teams[team] !== undefined) {
			logoID = teams[team].id;
		}

		return '/' + logoID + '.png';
	}

	static canLink(year, team) {
		if (year === undefined)
			return false;

		for (var i in clubs.seasons) {
			if (clubs.seasons[i].teams[year] === undefined) {
				continue;
			}

			if (clubs.seasons[i].teams[year].includes(team)) {
				return true;
			}
		}

		return false;
	}
}	
