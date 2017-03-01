import React, { Component } from 'react';

import './style.css';

export default class PlayerStats extends Component {

	constructor(props) {
		super(props);
		this.state = {
			appearances: [],
			goals: []
		};
		
		this.selectSeason = this.selectSeason.bind(this);
	}

	componentDidMount() {
		this.selectSeason(this.props.season, this.props.team);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.season !== nextProps.season ||
				this.props.team !== nextProps.team) {
			this.selectSeason(nextProps.season, nextProps.team);
		}
	}

  render() {
    return (
      <div className="PlayerStats">
				<div className="PlayerStats-flex-container">
					<div className="flex-1 PlayerStats-appearances">
						<h3>
							Appearances <small>({this.state.appearances.length} players)</small>
						</h3>
						{this.state.appearances.map(player => {
							return (
								<div key={player.name}>
									{player.number} {player.name} {
										player.startMatches.length > 0 &&
										<span>{player.startMatches.length}</span>
									}
									{
										player.subMatches.length > 0 &&
										<span>({player.subMatches.length})</span>
									}
								</div>
							);
						})}
					</div>
					<div className="flex-1 PlayerStats-goals">
						<h3>
							Goals <small>({this.state.goals.length} players)</small>
						</h3>
						{this.state.goals.map(player => {
							return (
								<div key={player.name}>
									{player.number} {player.name} {player.goalMatches.length}
								</div>
							);
						})}
					</div>
				</div>
      </div>
    );
  }

	selectSeason(season, team) {
		const that = this;
		const url = '/api/season/select/' + season + '/' + team.replace(/ /g, '-');

		fetch(url)
			.then(function(response) {
				return response.json();
			})
		.then(function(data) {
			const stats = that.getStats(data.competitions);
			that.setState(stats);
		});
	}

	getStats(competitions) {
		var stats = {
			appearances: [],
			goals: []
		};
		var playerMap = {};
		var competition, match, summary, side, players;
		var goal, player, name, newMatch;
		var i, j, k;

		function initPlayer(name) {
			if (playerMap[name] === undefined) {
				playerMap[name] = {
					name: name,
					goalMatches: [],
					startMatches: [],
					subMatches: []
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
				side = (summary.r === this.props.team) ? 'r' : 'l';

				for (k = 0; k < summary.goals.length; k++) {
					goal = summary.goals[k];
					if (goal.side === side && goal.style !== 'own goal') {
						name = goal.scorer;
						initPlayer(name);
						playerMap[name].goalMatches.push(newMatch);
					}
				}

				players = summary.players[side];
				
				for (k = 0; k < players.start.length; k++) {
					player = players.start[k];
					name = player.name;
					initPlayer(name);
					playerMap[name].startMatches.push(newMatch);
					if (player.number) {
						playerMap[name].number = player.number;
					}
				}
				
				for (k = 0; k < players.sub.length; k++) {
					player = players.sub[k];
					if (player.sub) {
						name = player.name;
						initPlayer(name);
						playerMap[name].subMatches.push(newMatch);
						if (player.number) {
							playerMap[name].number = player.number;
						}
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
			}
		}
		
		stats.goals.sort(function(a, b) {
			return b.goalMatches.length - a.goalMatches.length;
		});

		stats.appearances.sort(function(a, b) {
			var aStart = a.startMatches.length;
			var bStart = b.startMatches.length;
			var aSub = a.subMatches.length;
			var bSub = b.subMatches.length;

			if (aStart > bStart) {
				return -1;
			}
			else if (aStart < bStart) {
				return 1;
			}
			else {
				if (aSub > bSub) {
					return -1;
				}
				else if (aSub < bSub) {
					return 1;
				}
			}

			return 0;
		});

		return stats;
	}
}
