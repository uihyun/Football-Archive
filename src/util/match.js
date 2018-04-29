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

	static summarizeResult(match, team) {
		const summary = match.summary;
		var sum = {result: 'unplayed', resultFull: 'unplayed'};
		var [goalsScored, goalsConceded, isValid] = this.getGoals(match, team);
    var i, goal;

		if (isValid) {
      const side = (summary && summary.r === team) ? 'r' : 'l';

      if (goalsScored > goalsConceded) {
        sum.result = sum.resultFull = 'win';
      } else if (goalsScored < goalsConceded) {
        sum.result = sum.resultFull = 'loss';
      } else {
        sum.result = sum.resultFull = 'draw';

        if (summary && summary.penalties !== undefined) {
          let pkFor = 0;
          let pkAgainst = 0;
          for (i = 0; i < summary.penalties.length; i++) {
            goal = summary.penalties[i];
            if (goal.result) {
              if (goal.side === side) {
                pkFor++;
              } else {
                pkAgainst++;
              }
            }
          }

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

	static getColor(result) {
		switch (result) {
			case 'win':
				return 'blue';
			case 'win-pso':
				return 'green';
			case 'draw':
				return 'yellow';
			case 'loss-pso':
				return 'orange';
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
}
