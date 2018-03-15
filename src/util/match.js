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
}
