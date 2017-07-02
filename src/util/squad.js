import playerNameException from '../data/players';

export default class SquadUtil {
	static getNewPlayer(player) {
		var name, number;
		number = player.number ? player.number : '?';

		if (playerNameException[player.name]) {
			name = playerNameException[player.name].name;
		} else {
			var split = player.name.split(" ").reverse();
			name = split[0];
		}

		return {name: name, number: number, fullname: player.name};
	}

	static getSquadArray(data, team) {
		var competition, match, summary, side, players, player;
		var i, j, k;
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

				for (k = 0; k < players.sub.length; k++) {
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
			return a.number - b.number;
		});

		return array;
	}
}
