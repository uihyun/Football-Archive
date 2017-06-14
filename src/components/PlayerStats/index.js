import React, { Component } from 'react';

import './style.css';

import UrlUtil from '../../util/url';

export default class PlayerStats extends Component {

	constructor(props) {
		super(props);
		this.state = {
			appearances: [],
			goals: [],
			assists: []
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
					<div className="flex-1 PlayerStats-appearances PlayerStats-flex-item">
						<h3>
							Appearances <small>({this.state.appearances.length} players)</small>
						</h3>
						{this.state.appearances.map(player => {
							return (
								<div key={player.name} className="flex-container PlayerStats-row">
									<div className={"PlayerStats-backnumber text-center" + (player.sub ? " PlayerStats-backnumber-sub" : "")}>
										{player.number}
									</div>
									<div className="PlayerStats-name flex-1">
										{player.name}
									</div>
									<div className="PlayerStats-value text-right">
										{
											player.startMatches.length > 0 &&
											<span>{player.startMatches.length}</span>
										}
									</div>
									<div className="PlayerStats-value text-right">
										{
											player.subMatches.length > 0 &&
											<span>{player.subMatches.length}</span>
										}
									</div>
									<div className="PlayerStats-value-long text-right">
										{player.minutes}'
									</div>
								</div>
							);
						})}
					</div>
					<div className="flex-1 PlayerStats-goals PlayerStats-flex-item">
						<h3>
							Goals <small>({this.state.goals.length} players)</small>
						</h3>
						{this.state.goals.map(player => {
							return (
								<div key={player.name} className="flex-container PlayerStats-row">
									<div className="PlayerStats-backnumber text-center">
										{player.number}
									</div>
									<div className="PlayerStats-name flex-1">
										{player.name}
									</div>
									<div className="PlayerStats-value text-right">
										{player.goalMatches.length}
									</div>
								</div>
							);
						})}
					</div>
					<div className="flex-1 PlayerStats-assists PlayerStats-flex-item">
						<h3>
							Assists <small>({this.state.assists.length} players)</small>
						</h3>
						{this.state.assists.map(player => {
							return (
								<div key={player.name} className="flex-container PlayerStats-row">
									<div className="PlayerStats-backnumber text-center">
										{player.number}
									</div>
									<div className="PlayerStats-name flex-1">
										{player.name}
									</div>
									<div className="PlayerStats-value text-right">
										{player.assistMatches.length}
									</div>
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
		const url = UrlUtil.getSeasonSelectUrl(season, team);

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
			goals: [],
			assists: []
		};
		var playerMap = {};
		var competition, match, summary, side, players;
		var goal, player, name, newMatch, matchLength;
		var i, j, k;

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
				side = (summary.r === this.props.team) ? 'r' : 'l';
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

				players = summary.players[side];
				
				for (k = 0; k < players.start.length; k++) {
					player = players.start[k];
					name = player.name;
					initPlayer(name);
					playerMap[name].startMatches.push(newMatch);
					if (player.number) {
						playerMap[name].number = player.number;
					}

					if (player.sub) {
						playerMap[name].minutes += player.sub;
					} else {
						playerMap[name].minutes += matchLength;
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

						if (player.sub.length) {
							playerMap[name].minutes += player.sub[1] + 1 - player.sub[0];
						}
						else {
							playerMap[name].minutes += matchLength + 1 - player.sub;
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
