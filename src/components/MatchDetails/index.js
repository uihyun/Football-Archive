import React, { Component } from 'react';

import './style.css';

import {EmblemLarge} from '../Common';

export default class MatchDetails extends Component {

	render() {
		const match = this.props.match;
		const summary = match.summary;
		var l = '';
		var r = '';
		var goals = [];

		if (summary === undefined) {
			if (match.place === 'H') {
				l = this.props.team;
				r = match.vs;
			} else {
				l = match.vs;
				r = this.props.team;
			}
		} else {
			l = summary.l;
			r = summary.r;
			goals = summary.goals;
		}

		return (
			<div>
				<h3 className="text-center">
					<div>{match.competition} {match.round}</div>
					<div><small>{match.date}</small></div>
				</h3>
				<div className="flex-container">
					<div className="flex-1 hide-mobile"></div>
					<div className="flex-2">
						<div className="flex-container" onClick={this.props.showVersus}>
							<div className="flex-1"><EmblemLarge team={l} /></div>
							<div className="flex-1 text-center MatchDetails-score">{this.getScore()}</div>
							<div className="flex-1 text-right"><EmblemLarge team={r} /></div>
						</div>
						{goals.map((goal, index) => {return (this.getGoalDiv(goal, index));})}
					</div>
					<div className="flex-1 hide-mobile"></div>
				</div>
			</div>
		);
	}

	getGoalDiv(goal, index) {
		const side = goal.side;
		const minute = (<div className="MatchDetails-minute text-center">{goal.minute}</div>);
		const player = (
			<div className="MatchDetails-player">
				<div className="MatchDetails-scorer">
					{goal.scorer}
					{goal.style === 'own goal' && ' (own goal)'}
				</div>
				{goal.assist && <div className="MatchDetails-assist">assist by {goal.assist}</div>}
			</div>
		);
		
		var style = '';
		if (side === 'r') {
			style = 'MatchDetails-r-goal text-right';
		}

		return (
			<div key={index} className={'flex-container ' + style}>
				{minute} {player}
			</div>
		);
	}

	getScore() {

		if (this.props.match.summary === undefined) {
			return '';
		}

		const goals = this.props.match.summary.goals;
		var l = 0;
		var r = 0;

		for (var i in goals) {
			if (goals[i].side === 'l') {
				l++;
			} else {
				r++;
			}
		}

		return l + ' : ' + r;
	}
}
