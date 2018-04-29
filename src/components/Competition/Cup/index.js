import React, { Component } from 'react';

import './style.css';

import { Cup, ViewSelector } from '../../Common';

import Rounds from '../Rounds';

export default class CupView extends Component {
	
	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}

	getViews() {
		const cup = this.props.cup;
		var views = [];
		var [knockout, group] = this.getRounds();

		views.push({
			name: 'Standings',
			view: <Cup cup={cup} hideName={true} />
		});
		views.push({
			name: 'Rounds',
			view: <Rounds comp={cup} rounds={knockout} />
		});

		return views;
	}

	getRounds() {
		const rounds = this.props.cup.rounds;

		var knockout = [];
		var group = [];

		var i, round;
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name.includes('Group')) {
				knockout = [];
				group.push(round);
			} else {
				knockout.push(round);
			}
		}

		knockout.reverse();

		return [knockout, group];
	}
}
