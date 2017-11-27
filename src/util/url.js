export default class UrlUtil {
	static getTeamUrl(team) {
		team = team.replace(/á/g, 'a');
		team = team.replace(/é/g, 'e');
		team = team.replace(/É/g, 'E');
		team = team.replace(/ñ/g, 'n');
		team = team.replace(/ö/g, 'oe');
		team = team.replace(/ü/g, 'ue');
		team = team.replace(/\./g, '');
		return team.replace(/ & | /g, '-');
	}

	static getSeasonSelectUrl(season, team) {
		var url = '/api/season/select/' + season + '/' + this.getTeamUrl(team);
		return url;
	}

	static getSeasonFetchUrl(season, team) {
		var url = '/api/season/fetch/' + season + '/' + this.getTeamUrl(team);
		return url;
	}

	static getSeasonClearUrl(season, team) {
		var url = '/api/season/clear/' + season + '/' + this.getTeamUrl(team);
		return url;
	}

	static getMatchFetchUrl(season, team) {
		var url = '/api/match/fetch/' + season + '/' + this.getTeamUrl(team);
		return url;
	}

	static getMatchClearUrl(season, team) {
		var url = '/api/match/clear/' + season + '/' + this.getTeamUrl(team);
		return url;
	}
	
	static getVersusSelectUrl(teamA, teamB) {
		var url = '/api/versus/select/' + teamA + '/' + teamB;
		return url;
	}
}	
