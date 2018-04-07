export default class Match {
	static summarizeResult(match, team) {
		const summary = match.summary;
		let sum = {result: 'unplayed', resultFull: 'unplayed'};

		if (summary) {
      let goalsScored = 0;
      let goalsConceded = 0;
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

      if (goalsScored > goalsConceded) {
        sum.result = sum.resultFull = 'win';
      } else if (goalsScored < goalsConceded) {
        sum.result = sum.resultFull = 'loss';
      } else {
        sum.result = sum.resultFull = 'draw';

        if (summary.penalties !== undefined) {
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
}
