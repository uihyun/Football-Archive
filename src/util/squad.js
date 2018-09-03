import PlayerName from './playerName';

export default class SquadUtil {
	static getNewPlayer(player) {
		var name = PlayerName.divide(player.name);
		name.fullname = player.name;
		name.shorthand = PlayerName.capitalize(name.last);
		return name;
	}

	static getSquadArray(data) {
		const team = data.team;
		var competition, match, summary, side, players, player;
		var i, j, k, length;
		var playerMap = {};

		for (i = 0; i < data.competitions.length; i++) {
			competition = data.competitions[i];

			for (j = 0; j < competition.matches.length; j++) {
				match = competition.matches[j];

				if (match.summary === undefined)
					continue;

				summary = match.summary;

				if (summary.players === undefined)
					continue;

				side = (summary.r === team) ? 'r' : 'l';
				players = summary.players[side];

				for (k = 0; k < players.start.length; k++) {
					player = players.start[k];
				
					if (playerMap[player.name] === undefined) {
						playerMap[player.name] = SquadUtil.getNewPlayer(player);
					}
				}

				length = players.sub ? players.sub.length : 0;
				for (k = 0; k < length; k++) {
					player = players.sub[k];
					if (player.sub && playerMap[player.name] === undefined) {
						playerMap[player.name] = SquadUtil.getNewPlayer(player);
					}
				}	
			}
		}
					
		var array = [];
		for (player in playerMap) {
			if (playerMap[player]) {
				array.push(playerMap[player]);
			}
		}

		array.sort(function(a, b) {
			if (a.last === b.last) {
				return (a.first < b.first) ? -1 : 1;
			} else {
				return (a.last.toUpperCase() < b.last.toUpperCase()) ? -1 : 1;
			}
		});

		var playerA, playerB;
		var initialA, initialB;
		for (i = 1; i < array.length; i++) {
			playerA = array[i - 1];
			playerB = array[i];

			if (playerA.last === playerB.last) {
				initialA = playerA.first.substr(0, 1);
				initialB = playerB.first.substr(0, 1);

				if (initialA === initialB) {
					playerA.shorthand = PlayerName.fullname(playerA);
					playerB.shorthand = PlayerName.fullname(playerB);
				} else {
					playerA.shorthand = PlayerName.getNameWithInitial(playerA);
					playerB.shorthand = PlayerName.getNameWithInitial(playerB);
				}			
			}
		}

		return array;
	}

	static getStatistics(data, team) {
		const competitions = data.competitions;
		var stats = {
			appearances: [],
			goals: [],
			assists: []
		};
		var playerMap = {};
		var competition, match, summary, side, players;
		var goal, player, name, newMatch, matchLength;
		var i, j, k, l;

		function initPlayer(name) {
			if (playerMap[name] === undefined) {
				playerMap[name] = {
					name: name,
					goalMatches: [],
					assistMatches: [],
					startMatches: [],
					subMatches: [],
					minutes: 0
				};
			}
		}

		if (competitions === undefined)
			return stats;

		for (i = 0; i < competitions.length; i++) {
			competition = competitions[i];

			for (j = 0; j < competition.matches.length; j++) {
				match = JSON.parse(JSON.stringify(competition.matches[j]));
				newMatch = {competition: competition.name, date: match.date, vs: match.vs};

				if (match.summary === undefined)
					continue;

				summary = match.summary;
				side = (summary.r === team) ? 'r' : 'l';
				matchLength = summary.aet ? 120 : 90;

				for (k = 0; k < summary.goals.length; k++) {
					goal = summary.goals[k];
					if (goal.side === side && goal.style !== 'own goal') {
						name = goal.scorer;
						initPlayer(name);
						playerMap[name].goalMatches.push(newMatch);

						if (goal.assist !== undefined) {
							name = goal.assist;
							initPlayer(name);
							playerMap[name].assistMatches.push(newMatch);
						}
					}
				}

				if (summary.players === undefined)
					continue;

				players = summary.players[side];
				
				for (k = 0; k < players.start.length; k++) {
					player = players.start[k];
					name = player.name;
					initPlayer(name);
					playerMap[name].startMatches.push(newMatch);
					if (player.number) {
						playerMap[name].number = player.number;
					}

					for (l = 0; l < player.assist; l++) {
						playerMap[name].assistMatches.push(newMatch);
					}

					if (player.sub) {
						playerMap[name].minutes += player.sub;
					} else if (player.card &&
							(player.card.type === 'red' ||
							 player.card.type === 'Second yellow')) {
						playerMap[name].minutes += player.card.minute;
					} else {
						playerMap[name].minutes += matchLength;
					}
				}

				let length = players.sub === undefined ? 0 : players.sub.length;
				
				for (k = 0; k < length; k++) {
					player = players.sub[k];

					if (player.sub === undefined)
						continue;

					name = player.name;
					initPlayer(name);
					playerMap[name].subMatches.push(newMatch);
					if (player.number) {
						playerMap[name].number = player.number;
					}

					if (player.sub.length) {
						playerMap[name].minutes += player.sub[1] + 1 - player.sub[0];
					} else if (player.card &&
						(player.card.type === 'red' ||
							player.card.type === 'Second yellow')) {
						playerMap[name].minutes += player.card.minute + 1 - player.sub;
					} else {
						playerMap[name].minutes += matchLength + 1 - player.sub;
					}

					for (l = 0; l < player.assist; l++) {
						playerMap[name].assistMatches.push(newMatch);
					}
				}
			}
		}

		for (i in playerMap) {
			if (playerMap[i]) {
				player = playerMap[i];
				
				stats.appearances.push(player);
				if (player.goalMatches.length) {
					stats.goals.push(player);
				}
				if (player.assistMatches.length) {
					stats.assists.push(player);
				}
			}
		}
		
		stats.goals.sort(function(a, b) {
			return b.goalMatches.length - a.goalMatches.length;
		});
		
		stats.assists.sort(function(a, b) {
			return b.assistMatches.length - a.assistMatches.length;
		});

		stats.appearances.sort(function(a, b) {
			var aStart = a.startMatches.length;
			var bStart = b.startMatches.length;
			var aSub = a.subMatches.length;
			var bSub = b.subMatches.length;

			if (aStart > bStart) {
				return -1;
			} else if (aStart < bStart) {
				return 1;
			} else {
				if (aSub > bSub) {
					return -1;
				} else if (aSub < bSub) {
					return 1;
				} else if (a.number !== undefined && b.number !== undefined) {
					return a.number - b.number;
				}
			}

			return 0;
		});

		for (i = 0; i < stats.appearances.length; i++) {
			if (i < 11) {
				stats.appearances[i].sub = false;
			} else {
				stats.appearances[i].sub = true;
			}
		}

		return stats;
	}
}
