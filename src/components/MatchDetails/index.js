import React, { Component } from 'react';

import './style.css';

import {Team} from '../Common';

import PlayerName from '../../util/playerName';

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
	
		var year = parseInt(match.date.substring(6, 10), 10);
		var month = parseInt(match.date.substring(0, 2), 10);

		if (month >= 8)
			year++;

		return (
			<div>
				<h3 className="text-center">
					<div>{match.competition} {match.round}</div>
					<div><small>{match.date}</small></div>
				</h3>
				<div className="flex-container">
					<div className="flex-1 hide-mobile"></div>
					<div className="flex-2">
						<div className="flex-container">
							<div className="flex-1"><Team team={l} emblemLarge={true} year={year}/></div>
							<div className="flex-1 text-center MatchDetails-score">{this.getScore()}</div>
							<div className="flex-1 text-right"><Team team={r} emblemLarge={true} year={year}/></div>
						</div>
						{goals.map((goal, index) => {return (this.getGoalDiv(goal, index));})}
					</div>
					<div className="flex-1 hide-mobile"></div>
				</div>
				<div className="text-center" onClick={this.props.showVersus}>
					see history
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
					{PlayerName.getDisplayName(goal.scorer)}
					{goal.style === 'own goal' && ' (own goal)'}
				</div>
				{goal.assist && <div className="MatchDetails-assist">assist by {PlayerName.getDisplayName(goal.assist)}</div>}
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
