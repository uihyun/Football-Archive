import React, { Component } from 'react';

import './style.css';

import { PlayerName, ViewSelector } from '../Common';

export default class Statistics extends Component {

	constructor(props) {
		super(props);
		
		this.state = this.newState(this.props.data, this.props.team);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps.data, nextProps.team));
	}

  render() {
		const views = [this.getAppearances(), this.getGoals(), this.getAssists()];
    return (
      <div className="Statistics">
				<ViewSelector views={views} expand={true} />
      </div>
    );
  }

	getAppearances() {
		const view = (
			<div className="Statistics-item">
				<h3>
					Appearances <small>({this.state.appearances.length} players)</small>
				</h3>
				{this.state.appearances.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className={"Statistics-backnumber text-center" + (player.sub ? " Statistics-backnumber-sub" : "")}>
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{
									player.startMatches.length > 0 &&
									player.startMatches.length
								}
							</div>
							<div className="Statistics-value text-right">
								{
									player.subMatches.length > 0 &&
									<small>{player.subMatches.length}</small>
								}
							</div>
							<div className="Statistics-value-long text-right">
								{player.minutes}'
							</div>
						</div>
					);
				})}
			</div>
		);

		return { name: 'Appearances', sh: 'App', view: view };
	}

	getGoals() {
		const view = (
			<div className="Statistics-item">
				<h3>
					Goals <small>({this.state.goals.length} players)</small>
				</h3>
				{this.state.goals.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className="Statistics-backnumber text-center">
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{player.goalMatches.length}
							</div>
						</div>
					);
				})}
			</div>
		);

		return { name: 'Goals', sh: 'Goal', view: view };
	}

	getAssists() {
		const view = (
			<div className="Statistics-item">
				<h3>
					Assists <small>({this.state.assists.length} players)</small>
				</h3>
				{this.state.assists.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className="Statistics-backnumber text-center">
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{player.assistMatches.length}
							</div>
						</div>
					);
				})}
			</div>
		);

		return { name: 'Assists', sh: 'Ass', view: view };
	}

	newState(data, team) {
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
