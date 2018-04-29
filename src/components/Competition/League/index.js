import React, { Component } from 'react';

import './style.css';

import { LeagueTable, ViewSelector } from '../../Common';

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

		return views;
	}
}
