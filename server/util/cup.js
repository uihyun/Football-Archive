'use strict';

const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const CmpUtil = require('./cmp');
const KLeagueUtil = require('./kleague');

module.exports = {
	isValid: function(competition) {
		switch (competition) {
			// nations
			case 'World Cup':
			case 'Confederations Cup':
			case 'EURO':
			case 'Copa América':
			case 'Gold Cup':
			case 'Africa Cup':
			case 'Asian Cup':
			// clubs
			case 'Champions League':
			case 'Europa League':
			case 'FA Cup':
			case 'Copa del Rey':
			case 'Coppa Italia':
			case 'DFB-Pokal':
			case 'Coupe de France':
			case 'League Cup':
			case 'Coupe de la Ligue':
			// AFC
			case 'AFC Champions League':
			case 'Emperor\'s Cup':
			case 'J League Cup':
			case 'CFA Cup':
				return true;
			default:
				return false;
		}
	},
	useH2H: function (competition) {
		switch (competition) {
			// nations
			case 'EURO':
			// clubs
			case 'Champions League':
			case 'Europa League':
				return true;
			default:
				return false;
		}
	},
	oldCups: [
		{ season: '2010', name:	'World Cup', url: '/all_matches/wm-2010-in-suedafrika/' },
		{ season: '2006', name:	'World Cup', url: '/all_matches/wm-2006-in-deutschland/' },
		{ season: '2002', name:	'World Cup', url: '/all_matches/wm-2002-in-japan-suedkorea/' },
		{ season: '2013', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2013-in-brasilien/' },
		{ season: '2009', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2009-in-suedafrika/' },
		{ season: '2005', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2005-in-deutschland/' },
		{ season: '2003', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2003-in-frankreich/' },
		{ season: '2001', name:	'Confederations Cup', url: '/all_matches/confederations-cup-2001-in-japan-suedkorea/' },
		{ season: '2012', name:	'EURO', url: '/all_matches/em-2012-in-polen-ukraine/' },
		{ season: '2008', name:	'EURO', url: '/all_matches/em-2008-in-oesterreich-schweiz/' },
		{ season: '2004', name:	'EURO', url: '/all_matches/em-2004-in-portugal/' },
		{ season: '2000', name:	'EURO', url: '/all_matches/em-2000-in-holland-belgien/' },
		{ season: '2011', name:	'Copa América', url: '/all_matches/copa-america-2011-in-argentinien/' },
		{ season: '2007', name:	'Copa América', url: '/all_matches/copa-america-2007-in-venezuela/' },
		{ season: '2004', name:	'Copa América', url: '/all_matches/copa-america-2004-in-peru/' },
		{ season: '2001', name:	'Copa América', url: '/all_matches/copa-america-2001-in-kolumbien/' },
		{ season: '2013', name:	'Gold Cup', url: '/all_matches/gold-cup-2013-usa/' },
		{ season: '2011', name:	'Gold Cup', url: '/all_matches/gold-cup-2011-usa/' },
		{ season: '2009', name:	'Gold Cup', url: '/all_matches/gold-cup-2009-usa/' },
		{ season: '2007', name:	'Gold Cup', url: '/all_matches/gold-cup-2007-usa/' },
		{ season: '2005', name:	'Gold Cup', url: '/all_matches/gold-cup-2005-usa/' },
		{ season: '2003', name:	'Gold Cup', url: '/all_matches/gold-cup-2003-usa-mexiko/' },
		{ season: '2002', name:	'Gold Cup', url: '/all_matches/gold-cup-2002-usa/' },
		{ season: '2000', name:	'Gold Cup', url: '/all_matches/gold-cup-2000-usa/' },
		{ season: '2013', name:	'Africa Cup', url: '/all_matches/afrika-cup-2013-suedafrika/' },
		{ season: '2012', name:	'Africa Cup', url: '/all_matches/afrika-cup-2012-gabun-und-aequatorialg/' },
		{ season: '2010', name:	'Africa Cup', url: '/all_matches/afrika-cup-2010-angola/' },
		{ season: '2008', name:	'Africa Cup', url: '/all_matches/afrika-cup-2008-in-ghana/' },
		{ season: '2006', name:	'Africa Cup', url: '/all_matches/afrika-cup-2006-in-aegypten/' },
		{ season: '2004', name:	'Africa Cup', url: '/all_matches/afrika-cup-2004-in-tunesien/' },
		{ season: '2002', name:	'Africa Cup', url: '/all_matches/afrika-cup-2002-in-mali/' },
		{ season: '2000', name:	'Africa Cup', url: '/all_matches/afrika-cup-2000-in-ghana-nigeria/' },
		{ season: '2011', name:	'Asian Cup', url: '/all_matches/asian-cup-2011-katar/' },
		{ season: '2007', name:	'Asian Cup', url: '/all_matches/asian-cup-2007-idn-mas-tha-vie/' },
		{ season: '2004', name:	'Asian Cup', url: '/all_matches/asian-cup-2004-china/' },
		{ season: '2000', name:	'Asian Cup', url: '/all_matches/asian-cup-2000-libanon/' },
	],
	getGroupTable: function(group, competition) {
		var teamMap = {};
		var i, match;
		var teamL, teamR;
		var h2hL, h2hR;
		var score;

		for (i = 0; i < group.matches.length; i++) {
			match = group.matches[i];
			if (teamMap[match.l] === undefined)
				teamMap[match.l] = CmpUtil.getEmptyTeam(match.l);
			if (teamMap[match.r] === undefined)
				teamMap[match.r] = CmpUtil.getEmptyTeam(match.r);

			if (teamMap[match.l].h2h[match.r] === undefined)
				teamMap[match.l].h2h[match.r] = CmpUtil.getEmptyH2H();
			if (teamMap[match.r].h2h[match.l] === undefined)
				teamMap[match.r].h2h[match.l] = CmpUtil.getEmptyH2H();
		}

		for (i = 0; i < group.matches.length; i++) {
			match = group.matches[i];
			
			teamL = teamMap[match.l];
			teamR = teamMap[match.r];

			h2hL = teamL.h2h[match.r];
			h2hR = teamR.h2h[match.l];

			if (match.score === undefined)
				continue;

			score = match.score.split(':').map(a => { return parseInt(a, 10); });
			if (score[0] < score[1]) {
				teamL.games.l++;
				teamR.games.w++;

				h2hL.games.l++;
				h2hR.games.w++;
				h2hR.points += 3;
			} else if (score[0] > score[1]) {
				teamL.games.w++;
				teamR.games.l++;

				h2hL.games.w++;
				h2hR.games.l++;
				h2hL.points += 3;
			} else {
				teamL.games.d++;
				teamR.games.d++;

				h2hL.games.d++;
				h2hR.games.d++;
				h2hL.points++;
				h2hR.points++;
			}
					
			teamL.goals.f += score[0];
			teamL.goals.a += score[1];
			teamR.goals.f += score[1];
			teamR.goals.a += score[0];

			h2hL.goals.f += score[0];
			h2hL.goals.a += score[1];
			h2hR.goals.f += score[1];
			h2hR.goals.a += score[0];
			h2hR.goals.away += score[1];

			h2hL.games.p++;
			h2hR.games.p++;
		}
				
		var team;
		var teamArray = [];
		for (i in teamMap) {
			team = teamMap[i];
			team.games.p = team.games.w + team.games.d + team.games.l;
			team.goals.d = team.goals.f - team.goals.a;
			team.points = 3 * team.games.w + team.games.d;
			teamArray.push(team);
		}
				
		var cmpFn = this.useH2H(competition) ? CmpUtil.compareFnH2H : CmpUtil.compareFn;
		teamArray.sort(cmpFn);

		var prevRank = 1;
		teamArray[0].rank = 1;
		for (i = 1; i < teamArray.length; i++) {
			team = teamArray[i];
			if (cmpFn(teamArray[i-1], team) === 0) {
				team.rank = prevRank;
			} else {
				team.rank = prevRank = i+1;
			}
		}

		teamArray.sort(CmpUtil.compareFnWithName);

		for (i = 0; i < teamArray.length; i++) {
			delete teamArray[i].h2h;
		}

		return teamArray; 
	},
	findWinner: function(round) {
		var match = round.matches[round.matches.length - 1];
		var score, fullScore, score1, score2, winner;

		if (round.matches.length === 1) {
			if (round.matches[0].score !== undefined) {
				if (match.pk !== undefined) {
					score = match.pk.split(':').map(a => { return parseInt(a, 10); });
				} else {
					score = match.score.split(':').map(a => { return parseInt(a, 10); });
				}
				return score[0] < score[1] ? match.r : match.l;
			}
		} else if (round.matches.length === 2) {
			if (round.matches[0].score !== undefined &&
					round.matches[1].score !== undefined) {
				if (match.pk !== undefined) {
					score = match.pk.split(':').map(a => { return parseInt(a, 10); });
				} else {
					score1 = round.matches[0].score.split(':').map(a => { return parseInt(a, 10); });
					score2 = round.matches[1].score.split(':').map(a => { return parseInt(a, 10); });
					
					fullScore = [score1[1] + score2[0], score1[0] + score2[1]];
					
					if (fullScore[0] !== fullScore[1]) {
						score = fullScore;
					} else {
						score = [score1[1], score2[0]];
					}
				}
				return score[0] < score[1] ? match.r : match.l;
			}
		}

		return null;
	},
	fetch: function(cup) {
		return new Promise(async function (resolve, reject) {
			const CupUtil = require('./cup');
			const execStr = 'perl ' + path.join(__dirname, '../../perl', 'cup.pl') + ' ' + cup.url;
			const teamNameMap = KLeagueUtil.replaceTeamNameMap;
			const { stdout, stderr } = await exec(execStr);

			var data;

			try {
				data = JSON.parse(stdout);
			} catch(err) {
				console.log(stdout);
				console.log(err);
				reject();
			}

			var i, round;
			var j, match;
			var winner;
			var teams = {};

			for (i = 0; i < data.length; i++) {
				round = data[i];

				for (j = 0; j < round.matches.length; j++) {
					match = round.matches[j];

					if (teamNameMap[match.l])
						match.l = teamNameMap[match.l];

					if (teamNameMap[match.r])
						match.r = teamNameMap[match.r];

					if (cup.teamMap[match.l] !== true &&
						cup.teamMap[match.r] !== true) {
						delete match.url;
					}

					teams[match.l] = true;
					teams[match.r] = true;
				}

				if (round.name.match(/group/i)) {
					round.table = CupUtil.getGroupTable(round, cup.name);
				}

				if (round.name === 'Final') {
					winner = CupUtil.findWinner(round);
					if (winner !== null) {
						cup.winner = winner;
					}
				}					
			}

			delete cup.teamMap;
			cup.rounds = data;

			var teamArray = [];
			for (i in teams) {
				teamArray.push(i);
			}
			cup.teams = teamArray;

			resolve(cup);
		});
	},
};
