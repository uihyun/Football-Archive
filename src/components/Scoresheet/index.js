import React, { Component } from 'react';

import './style.css';

import players from '../../data/players';

export default class Match extends Component {
		
	render() {
		var scorers = [];
		var i, j, found;
		var goal;
		const goals = this.props.goals;
		const side = this.props.side;
		var name;

		for (i in goals) {
			if (goals[i]) {
				goal = goals[i];
				if (goal.side === side) {
					found = false;
					name = goal.scorer;

					if (goal.style === 'own goal') {
						name = 'og';
					}

					for (j in scorers) {
						if (scorers[j].fullname === name) {
							scorers[j].minutes.push(goal.minute);
							found = true;
						}
					}

					if (!found) {
						scorers.push({fullname: name, minutes: [goal.minute]});
					}
				}
			}
		}

		var scorer;
		for (i = 0; i < scorers.length; i++) {
			scorer = scorers[i];
			if (players[scorer.fullname]) {
				scorer.name = players[scorer.fullname].name;
			} else {
				scorer.name = scorer.fullname.replace(/.* /, '');
			}
		}

		return (
			<span className="Scoresheet">
				<small>
				{scorers.map(scorer => {
					var className='';

					if (this.props.selectedPlayer &&
							scorer.fullname === this.props.selectedPlayer.fullname) {
						className += ' Scoresheet-selected';
					}

					return (
						<span key={scorer.name} className={className}>
						{scorer.name} {scorer.minutes.map(minute => {
							return (<span key={minute}>{minute}' </span>);
						})}
						</span>
					)
				})}
				</small>
			</span>
		);
	}
}
