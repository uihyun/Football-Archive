import {teams, competitions, clubs, nations} from '../data';

export default class UrlUtil {
	static getTeamUrl(team) {

		if (teams[team] && teams[team].url)
			return teams[team].url;

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

	static getCompUrl(comp) {
		if (competitions[comp] && competitions[comp].url)
			return competitions[comp].url;

		return comp.replace(/ /g, '-');
	}
	
	static getRecentMatchesUrl(season) {
		return '/api/match/recent/' + season;
	}
	
	static getCupFetchUrl(season) {
		return '/api/cup/fetch/' + season;
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

	static getCompetitionSelectUrl(season, team) {
		return '/api/competition/select/' + season + '/' + this.getTeamUrl(team);
	}
	
	static getVersusSelectUrl(teamA, teamB) {
		return '/api/versus/select/' + teamA + '/' + teamB;
	}
	
	static getMatchSelectUrl(url) {
		return '/api/match/select/' + url;
	}
	
	static getTeamHistoryUrl(team) {
		return '/api/history/team/' + this.getTeamUrl(team);
	}
	
	static getCompetitionHistoryUrl(competition) {
		return '/api/history/competition/' + this.getCompUrl(competition);
	}

	static getEmblemUrl(team) {
		var logoID = 2608043;

		if (teams[team] !== undefined && teams[team].id) {
			logoID = teams[team].id;
		}

		return '/' + logoID + '.png';
	}

	static getLink(year, team) {
		if (year === undefined)
			return null;

		var i;

		for (i in clubs.seasons) {
			if (clubs.seasons[i].teams[year] === undefined) {
				continue;
			}

			if (clubs.seasons[i].teams[year].includes(team)) {
				return '/club/' + year + '/' + this.getTeamUrl(team);
			}
		}

		for (i in nations.countries) {
			if (nations.countries[i].includes(team)) {
				if (year > nations.years.max || year < nations.years.min) {
					return null;
				}

				return '/nation/' + year + '/' + this.getTeamUrl(team);
			}
		}

		return null;
	}

	static getCompLink(yearString, comp) {
		if (yearString === undefined || comp === undefined)
			return null;

		const url = this.getCompUrl(comp);
		const link = '/competition/' + yearString + '/' + url;
		const year = parseInt(yearString, 10);
		var competition = competitions[comp];

		if (competition) {
			if (competition.years &&
					competition.years.min <= year && competition.years.max >= year) {
				return link;
			}

			if (competition.times &&
					competition.times.includes(year)) {
				return link;
			}
		}

		return null;
	}
}	
