import React, { Component } from 'react';

import './style.css';

import { Cup, PageSelector } from '../../Common';

import Group from './group';
import Goal from './goal';
import Rounds from '../Rounds';

export default class CupView extends Component {
	
	render() {
		return (
			<PageSelector views={this.getViews()} basename={this.props.basename} />
		);
	}

	getViews() {
		const cup = this.props.cup;
		var views = [];
		var [knockout, group] = this.getRounds();

		views.push({
			name: 'Standings',
			link: '/standings',
			component: Cup,
			data: { cup: cup, hideName: true }
		});

		if (knockout.length) {
			views.push({
				name: 'Knockout',
				link: '/knockout',
				component: Rounds,
				data: { comp: cup, rounds: knockout }
			});
		}	

		if (group.length) {
			views.push({
				name: 'Group Stage',
				sh: 'Groups',
				link: '/group',
				component: Group,
				data: { cup: cup, group: group, basename: this.props.basename + '/group' }
			});
		}

		const goals = this.props.goals;
		if (goals) {
			views.push({
				name: 'Goals',
				link: '/goal',
				component: Goal,
				data: { goals: goals, year: cup.season }
			});
		}

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
