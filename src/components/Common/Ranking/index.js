import React, { Component } from 'react';

import './style.css';

import { PlayerName, ViewSelector, Team } from '..';

export default class Ranking extends Component {

	render() {
		var views = [];
		views.push(this.getView('League', 'leagueGoals'));
		views.push(this.getView('All Season', 'seasonGoals'));

		return (
			<ViewSelector views={views} />
		);	
	}

	getView(name, code) {
		const scorers = this.getScorers(code);

		return {
			name: name,
			view: (
			<div className="Ranking">
				<br />
				{scorers.map(player => {
					return (
						<div key={player.name + player.team} className="flex-container">
							<div className="flex-1"></div>
							<div className="flex-container Ranking-row">
								<div className="Ranking-team"> <Team team={player.team} emblemSmall={true} /></div>
								<div className="flex-1"><PlayerName player={player.name} /></div>
								<div className="text-right">{player[code]}</div>
							</div>
							<div className="flex-1"></div>
						</div>
					);
				})}
			</div>
		)};
	}

	getScorers(code) {
		var array = [];

		if (this.props.goals === undefined)
			return array;

		var i, scorer;
		for (i = 0; i < this.props.goals.length; i++) {
			scorer = this.props.goals[i];

			if (scorer[code] > 0) {
				array.push(scorer);
			}
		}

		array.sort((a, b) => { 
			if (b[code] === a[code]) {
				return (a.team + a.name < b.team + b.name) ? -1 : 1;
			}

			return b[code] - a[code];
		});

		array.splice(300);

		return array;
	}
}
