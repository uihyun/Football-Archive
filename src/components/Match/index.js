import React, { Component } from 'react';

import './style.css';

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
		if (summary) {
			score = <span>{goals_scored}:{goals_conceded}</span>;
		} else {
			score = <button onClick={this.fetchMatch}>?</button>;
		}

		return (
			<div className="Match">
				{mm}/{dd} {score} vs {match.vs} <small>({match.competition})</small>
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
