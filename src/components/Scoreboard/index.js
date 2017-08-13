import React, { Component } from 'react';

import './style.css';

export default class Scoreboard extends Component {
  render() {
		const match = this.props.match;
		const dateA = match.date.split('/');
		const mm = dateA[0];
		const dd = dateA[1];
		const summary = match.summary;
		let score = null;
		let bg = null;
		var scoreStyle = '';
		if (summary) {
			let goals_scored = 0;
			let goals_conceded = 0;
			var goal;
			const side = (summary.r === this.props.team) ? 'r' : 'l';

			for (var i = 0; i < summary.goals.length; i++) {
				goal = summary.goals[i];
				if (goal.side === side) {
					goals_scored++;
				} else {
					goals_conceded++;
				}
			}

			if (goals_scored > goals_conceded) {
				scoreStyle = 'Scoreboard-win';
			} else if (goals_scored < goals_conceded) {
				scoreStyle = 'Scoreboard-loss';
			} else {
				scoreStyle = 'Scoreboard-draw';

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
						scoreStyle = 'Scoreboard-win-pso';
					} else {
						scoreStyle = 'Scoreboard-loss-pso';
					}
				}
			}
			score = <span className="condensed">{goals_scored} : {goals_conceded}</span>;

			if (this.props.player && this.props.player.fullname) {
				var fullname = this.props.player.fullname;
				bg = this.playerBackground(summary.players[side], fullname, scoreStyle);
				if (this.playerPlayed(summary.players[side], fullname)) {
					score = <small>{this.playerScored(summary.goals, side, fullname)}</small>;
				} else {
					scoreStyle += '-didNotPlay';
					score = null;
				}
			}
		} else {
			scoreStyle = 'Scoreboard-unplayed';
			score = <span><small>{mm}/{dd}</small></span>;
		}

    return (<div className={this.props.classNames + ' Scoreboard ' + scoreStyle}>{bg}<div className='Scoreboard-inner'>{score}</div></div>);
	}

	playerBackground(players, player, style) {
		for (var i = 0; i < players.start.length; i++) {
			if (players.start[i].name === player) {
				if (players.start[i].sub) {
					return <div className={style + '-out Scoreboard-out'}></div>;
				} else {
					return null;
				}
			}
		}

		for (i = 0; i < players.sub.length; i++) {
			if (players.sub[i].name === player) {
				if (players.sub[i].sub) {
					return <div className={style + '-in Scoreboard-in'}></div>;
				} else {
					return null;
				}
			}
		}

		return null;
	}

	playerPlayed(players, player) {
		for (var i = 0; i < players.start.length; i++) {
			if (players.start[i].name === player) {
				return true;
			}
		}

		for (i = 0; i < players.sub.length; i++) {
			if (players.sub[i].name === player) {
				return (players.sub[i].sub !== undefined);
			}
		}

		return false;
	}

	playerScored(goals, side, player) {
		var goal;
		var goalCount = 0;
		var assistCount = 0;

		for (var i = 0; i < goals.length; i++) {
			goal = goals[i];

			if (goal.side !== side)
				continue;

			if (goal.scorer === player)
				goalCount++;

			if (goal.assist === player)
				assistCount++;
		}

		var a = '';
		if (assistCount > 0) {
			if (assistCount > 1) {
				a = assistCount;
			}
			a += 'a';
		}
		
		var g = '';
		if (goalCount > 0) {
			if (goalCount > 1) {
				g = goalCount;
			}
			g += '⚽';
		}

		return g + a;
	}
}
