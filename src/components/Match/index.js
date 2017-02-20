import React, { Component } from 'react';

import './style.css';

import Competition from '../Competition';
import Team from '../Team';

export default class Match extends Component {

	constructor(props) {
		super(props);

		this.fetchMatch = this.fetchMatch.bind(this);
		this.onUpdateDone = this.onUpdateDone.bind(this);
	}

	render() {
		const match = this.props.match;
		const dateA = match.date.split('/');
		const mm = dateA[0];
		const dd = dateA[1];
		const summary = match.summary;
		var goals_scored = '-';
		var goals_conceded = '-';

		console.log (match);

		if (summary) {
			var i;
			var goal;
			const side = summary.r ? 'r' : 'l';

			goals_scored = 0;
			goals_conceded = 0;

			for (i in summary.goals) {
				if (summary.goals[i]) {
					goal = summary.goals[i];
					if (goal.side === side) {
						goals_scored++;
					} else {
						goals_conceded++;
					}
				}
			}
		}

		let score = null;
		var scoreStyle;
		if (summary) {
			if (goals_scored > goals_conceded) {
				scoreStyle = 'win';
			} else if (goals_scored < goals_conceded) {
				scoreStyle = 'loss';
			}
			score = <span className="condensed">{goals_scored} : {goals_conceded}</span>;
		} else {
			score = <span onClick={this.fetchMatch}><small>{mm}/{dd}</small></span>;
		}

		return (
			<div className="Match flex-container">
				<div className="flex-item flex-1 competition">
					<Competition name={match.competition} round={match.round} />
				</div>
				<div className={"flex-item score " + scoreStyle}>{score}</div>
				<div className="flex-item flex-1">
					<Team name={match.vs} />
				</div>
			</div>
		);
	}

	fetchMatch() {
		const that = this;
		const url ='/api/match/fetch/' + this.props.match.url;

		fetch(url)
			.then(function(response) {
				that.onUpdateDone();
			});
	}

	onUpdateDone() {
		this.props.onUpdate();
	}
}
