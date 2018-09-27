import React, { Component } from 'react';

import './style.css';

import { LeagueTable, PageSelector } from '../../Common';

import Goals from './goals';
import PointMap from '../PointMap';
import Remaining from '../Remaining';

export default class LeagueView extends Component {
	
	render() {
		return (
			<PageSelector views={this.getViews()} basename={this.props.basename} />
		);
	}

	getViews() {
		const league = this.props.league;
		var views = [];

		views.push({
			name: 'Table',
			link: '/table',
			component: LeagueTable,
			data: { league: league, hideName: true }
		});

		if (this.canDisplayPoints()) {
			views.push({
				name: 'Points',
				link: '/points',
				component: PointMap,
				data: league
			});
		}

		if (this.canDisplayRemaining()) {
			views.push({
				name: 'Remaining',
				link: '/remaining',
				component: Remaining,
				data: league
			});
		}

		const goals = this.props.goals;
		if (goals) {
			views.push({
				name: 'Goals',
				link: '/goals',
				component: Goals,
				data: { goals: goals, year: league.season }
			});
		}

		return views;
	}

	canDisplayPoints() {
		const table = this.props.league.table;
		var max = 0;
		var i, team;
		
		for (i = 0; i < table.length; i++) {
			team = table[i];
			max = Math.max(max, team.points);
		}

		return max > 0;
	}

	canDisplayRemaining() {
		const table = this.props.league.table;
		var min = 100;
		var i, team;

		for (i = 0; i < table.length; i++) {
			team = table[i];
			min = Math.min(min, team.games.p);
		}

		var maxRemaining = ((table.length - 1) * 2) - min;

		if (maxRemaining === 0 || maxRemaining >= table.length) {
			return false;
		}

		return true;
	}
}
