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
		var scoreStyle;
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
			}
			score = <span className="condensed">{goals_scored} : {goals_conceded}</span>;
		} else {
			score = <span><small>{mm}/{dd}</small></span>;
		}

    return (<div className={this.props.classNames + ' Scoreboard ' + scoreStyle}>{score}</div>);
	}
}
