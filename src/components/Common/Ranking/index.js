import React, { Component } from 'react';

import './style.css';

import { PlayerName, Team } from '..';

export default class Ranking extends Component {
	render() {
		const scorers = this.getScorers();

		return (
			<div className="Ranking">
				<h3 className="text-center">Goals</h3>
				{scorers.map(player => {
					return (
						<div className="flex-container">
							<div className="flex-1"></div>
							<div key={player.name + player.team} className="flex-container Ranking-row">
								<div className="Ranking-team"> <Team team={player.team} emblemSmall={true} /></div>
								<div className="flex-1"><PlayerName player={player.name} /></div>
								<div className="text-right">{player.leagueGoals}</div>
							</div>
							<div className="flex-1"></div>
						</div>
					);
				})}
			</div>
		);
	}

	getScorers() {
		var array = [];

		console.log(this.props);

		if (this.props.goals === undefined)
			return array;

		var i, scorer;
		for (i = 0; i < this.props.goals.length; i++) {
			scorer = this.props.goals[i];
			console.log(scorer);

			if (scorer.leagueGoals > 0) {
				array.push(scorer);
			}
		}

		array.sort((a, b) => { 
			if (b.leagueGoals === a.leagueGoals) {
				return (a.team + a.name < b.team + b.name) ? -1 : 1;
			}

			return b.leagueGoals - a.leagueGoals;
		});

		return array;
	}
}
