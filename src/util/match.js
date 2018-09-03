export default class Match {

	static getGoals(match, team) {
		const summary = match.summary;
    var goalsScored = 0;
    var goalsConceded = 0;
		var isValid = true;

		if (summary) {
      var goal;
      const side = (summary.r === team) ? 'r' : 'l';

      for (var i = 0; i < summary.goals.length; i++) {
        goal = summary.goals[i];
        if (goal.side === side) {
          goalsScored++;
        } else {
          goalsConceded++;
        }
      }
		} else if (match.score) {
			var array = match.score.split(':');

			if (match.r === team)
				array.reverse();

			goalsScored = array[0];
			goalsConceded = array[1];
		} else {
			isValid = false;
		}

		return [goalsScored, goalsConceded, isValid];
	}

	static getPenalties(match, team) {
		const summary = match.summary;
		var pkFor = 0;
		var pkAgainst = 0;
		var hasPenalties = true;
		var array;

    if (summary && summary.penalties !== undefined) {
			var goal;
      const side = (summary.r === team) ? 'r' : 'l';
			
			for (var i = 0; i < summary.penalties.length; i++) {
				goal = summary.penalties[i];
				if (goal.result) {
					if (goal.side === side) {
						pkFor++;
					} else {
						pkAgainst++;
					}
				}
			}
		} else if (summary && summary.pso !== undefined) {
			array = summary.pso.split(':');

			if (summary.r === team)
				array.reverse();

			pkFor = array[0];
			pkAgainst = array[1];
			
		} else if (match.pk) {
			array = match.pk.split(':');

			if (match.r === team)
				array.reverse();

			pkFor = array[0];
			pkAgainst = array[1];
		} else {
			hasPenalties = false;
		}

		return [pkFor, pkAgainst, hasPenalties];
	}

	static summarizeResult(match, team) {
		var sum = {result: 'unplayed', resultFull: 'unplayed'};
		var [goalsScored, goalsConceded, isValid] = this.getGoals(match, team);
		var [pkFor, pkAgainst, hasPenalties] = this.getPenalties(match, team);

		if (isValid) {
      if (goalsScored > goalsConceded) {
        sum.result = sum.resultFull = 'win';
      } else if (goalsScored < goalsConceded) {
        sum.result = sum.resultFull = 'loss';
      } else {
        sum.result = sum.resultFull = 'draw';

				if (hasPenalties) {
          if (pkFor > pkAgainst) {
            sum.resultFull = 'win-pso';
          } else {
            sum.resultFull = 'loss-pso';
          }
        }
      }

			sum.goalsScored = goalsScored;
			sum.goalsConceded = goalsConceded;
		}

		return sum;
	}

	static extractAndSort(data) {
		const competitions = data.competitions;
		var out = [];
		var competition;
		var match;
		var array;

		if (competitions === undefined)
			return out;

		for (var i = 0; i < competitions.length; i++) {
			competition = competitions[i];

			for (var j = 0; j < competition.matches.length; j++) {
				match = JSON.parse(JSON.stringify(competition.matches[j]));
				match.competition = competition.name;
				array = match.date.split('/');
				match.dateI = parseInt(array[2] + array[0] + array[1], 10); // mm/dd/yyyy -> yyyymmdd
				out.push(match);
			}
		}

		out.sort((a, b) => { return a.dateI - b.dateI });

		return out;
	}

	static getShortenedData(matches) {
		var i, match;
		var lastMatchIndex = 0;
		for (i = matches.length - 1; i >= 0; i--) {
			match = matches[i];

			if (match.summary) {
				lastMatchIndex = i;
				break;
			}
		}

		let startIndex = Math.max(lastMatchIndex - 4, 0);
		let endIndex = Math.min(lastMatchIndex + 5, matches.length - 1);

		var compMap = {};
		for (i = startIndex; i <= endIndex; i++) {
			match = matches[i];

			if (compMap[match.competition] === undefined) {
				compMap[match.competition] = {name: match.competition, matches: []};
			}

			compMap[match.competition].matches.push(match);
		}
		
		var data = {competitions: []};
		for (i in compMap) {
			if (compMap[i]) {
				data.competitions.push(compMap[i]);
			}
		}

		return data;
	}

	static getColor(result) {
		switch (result) {
			case 'win':
				return 'blue';
			case 'win-pso':
				return 'green';
			case 'draw':
				return 'yellow';
			case 'loss-pso':
				return 'magenta';
			case 'loss':
				return 'red';
			case 'unplayed':
				return 'gray';
			default:
				return 'white';
		}
	}

	static getColorDNP(result) {
		return 'light' + this.getColor(result);
	}

	static groupMatches(matches) {
		var group = [];

		var i, match;
		var j, entry;
		var found;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			found = false;

			for (j = 0; j < group.length; j++) {
				entry = group[j];

				if (entry.teams.includes(match.l)) {
					entry.matches.push(match);
					found = true;
					break;
				}
			}

			if (found === false) {
				group.push({
					teams: [match.l, match.r],
					matches: [match]
				});
			}
		}

		return group;
	}
}
