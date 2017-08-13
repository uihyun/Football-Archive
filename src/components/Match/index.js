import React, { Component } from 'react';

import './style.css';

import Competition from '../Competition';
import Team from '../Team';
import Scoresheet from '../Scoresheet';
import Lineup from '../Lineup';
import Scoreboard from '../Scoreboard';

export default class Match extends Component {

	constructor(props) {
		super(props);

		this.onUpdateDone = this.onUpdateDone.bind(this);
	}

	render() {
		const match = this.props.match;
		const summary = match.summary;
		var scorers = [];
		var players = [];

		var showScorers = summary && (this.props.showScorers || this.props.showLineup);
		var showLineup = summary && this.props.showLineup;

		if (summary) {
			var i, j, found;
			var goal;
			const side = (summary.r === this.props.team) ? 'r' : 'l';

			for (i in summary.goals) {
				if (summary.goals[i]) {
					goal = summary.goals[i];
					if (goal.side === side) {

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
					}
				}
			}

			players = match.summary.players[side];

			var player;

			if (this.props.selectedPlayer && this.props.showOtherGames === false) {
				var hasSelectedPlayer = false;

				for (i in players.start) {
					if (players.start[i]) {
						player = players.start[i];
						if (player.name === this.props.selectedPlayer.fullname) {
							hasSelectedPlayer = true;
							break;
						}
					}
				}

				if (hasSelectedPlayer === false) {
					for (i in players.sub) {
						if (players.sub[i]) {
							player = players.sub[i];
							if (player.sub && player.name === this.props.selectedPlayer.fullname) {
								hasSelectedPlayer = true;
								break;
							}
						}
					}
				}
				
				if (hasSelectedPlayer === false) {
					showScorers = showLineup = false;
				}
			}
		}

		let matchMeta =
			<div>
				<div className="flex-container Match-row">
					<div className="flex-1 Match-margin flex-container-right-aligned">
						<Competition name={match.competition} round={match.round} />
					</div>
					<Scoreboard classNames="Match-margin" team={this.props.team} match={match} 
					 player={this.props.selectedPlayer}/>
					<div className="flex-1 Match-margin Match-team">
						<Team name={match.vs} />
					</div>
				</div>
				{
					showScorers &&
					<div className="Match-Scoresheet">
						<Scoresheet goals={summary.goals} side={(summary.r === this.props.team) ? 'r' : 'l'} 
						 selectedPlayer={this.props.selectedPlayer} />
					</div>
				}
			</div>
		;

		return (
			<div className="Match">
				{this.props.showLineup ? 
				<div className={'Match-flex-container ' + (showLineup ? 'Match-has-sum' : 'Match-no-sum')}>
					<div className="flex-1 Match-margin">
						{matchMeta}
					</div>
					<div className="flex-1 Match-margin">
						{showLineup &&
							<Lineup players={players}
							 selectedPlayer={this.props.selectedPlayer} />
						}
					</div>
				</div>
				: matchMeta 
				}
			</div>
		);
	}

	onUpdateDone() {
		this.props.onUpdate();
	}
}
