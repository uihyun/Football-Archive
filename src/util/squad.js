import PlayerName from './playerName';

export default class SquadUtil {
	static getNewPlayer(player) {
		var name = PlayerName.divide(player.name);
		name.fullname = player.name;
		name.shorthand = PlayerName.capitalize(name.last);
		return name;
	}

	static getSquadArray(data, team) {
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
}
