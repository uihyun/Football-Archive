import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {Team} from '../Common';

import PlayerName from '../../util/playerName';
import UrlUtil from '../../util/url';

export default class MatchDetails extends Component {
	
	constructor(props) {
		super(props);

		const url = this.props.match.params.url;

		this.state = {url: url, match: null};
	}

	componentDidMount() {
		this.fetch();
	}

	render() {
		if (this.state.match === null) {
			return null;
		}

		const match = this.state.match;
		const summary = match.summary;
		var l, r, goals;

		if (summary) {
			l = summary.l;
			r = summary.r;
			goals = summary.goals;
		} else {
			l = match.teams[0];
			r = match.teams[1];
			goals = [];
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
					<Link to={'/versus/' + UrlUtil.getTeamUrl(l) + '/' + UrlUtil.getTeamUrl(r)}>
						see history
					</Link>
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
		if (this.state.match.summary === undefined) {
			return '';
		}

		const goals = this.state.match.summary.goals;
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

	fetch() {
		const that = this;
		const url = UrlUtil.getMatchSelectUrl(this.state.url);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			that.setState({match: data});
		});
	}

}
