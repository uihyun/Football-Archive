import React, { Component } from 'react';

import './style.css';

import Competition from '../Competition';
import Team from '../Team';
import Scoresheet from '../Scoresheet';
import Lineup from '../Lineup';

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
		var scorers = [];
		var players = [];

		if (summary) {
			var i, j, found;
			var goal;
			const side = summary.r ? 'r' : 'l';

			var goals_scored = 0;
			var goals_conceded = 0;

			for (i in summary.goals) {
				if (summary.goals[i]) {
					goal = summary.goals[i];
					if (goal.side === side) {
						goals_scored++;

						found = false;
						for (j in scorers) {
							if (scorers[j].name === goal.scorer) {
								scorers[j].minutes.push(goal.minute);
								found = true;
							}
						}

						if (!found) {
							scorers.push({name: goal.scorer, minutes: [goal.minute]});
						}
					} else {
						goals_conceded++;
					}
				}
			}

			players = match.summary.players[side];
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

		let matchMeta =
			<div>
				<div className="flex-container">
					<div className="flex-item flex-1 competition">
						<Competition name={match.competition} round={match.round} />
					</div>
					<div className={"flex-item score " + scoreStyle}>{score}</div>
					<div className="flex-item flex-1">
						<Team name={match.vs} />
					</div>
				</div>
				{
					summary && (this.props.showScorers || this.props.showLineup) &&
					<div className="scoresheet">
						<Scoresheet goals={summary.goals} side={summary.r ? 'r' : 'l'} />
					</div>
				}
			</div>
		;

		return (
			<div className="Match">
				{this.props.showLineup ? 
				<div className={'flex-container-outer ' + (summary ? 'has-sum' : 'no-sum')}>
					<div className="flex-item flex-1">
						{matchMeta}
					</div>
					<div className="flex-item flex-1">
						{summary &&
							<Lineup players={players}
							 selectPlayer={this.props.selectPlayer} selectedPlayer={this.props.selectedPlayer} />
						}
					</div>
				</div>
				: matchMeta 
				}
			</div>
		);
	}

	dummySelectPlayer(player) {
		console.log(player);
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
