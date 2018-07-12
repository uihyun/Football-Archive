import React, { Component } from 'react';

import './style.css';

import { LeagueTable, ViewSelector, Ranking } from '../../Common';

import PointMap from '../PointMap';
import Remaining from '../Remaining';

export default class LeagueView extends Component {
	
	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}

	getViews() {
		const league = this.props.league;
		var views = [];

		views.push({
			name: 'Table',
			view: <LeagueTable league={league} hideName={true} />
		});

		if (this.canDisplayPoints()) {
			views.push({
				name: 'Points',
				view: <PointMap league={league} />
			});
		}

		if (this.canDisplayRemaining()) {
			views.push({
				name: 'Remaining',
				view: <Remaining league={league} />
			});
		}

		const goals = this.props.goals;
		if (goals) {
			views.push({
				name: 'Rankings',
				view: <Ranking goals={goals} />
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
