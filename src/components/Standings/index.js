import React, { Component } from 'react';

import './style.css';

import {LeagueTable, ViewSelector} from '../Common';
import {Cup} from '../Graphics';
import {competitions} from '../data';

export default class Standings extends Component {
	
	render() {
		return (
			<div>
				<ViewSelector views={this.getViews()} />
			</div>
		);
	}

	getViews() {
		const leagues = this.props.data.leagues;
		const team = this.props.team;

		var views = [];

		if (leagues[0]) {
			views.push({
				name: competitions[leagues[0].name].name,
				sh: competitions[leagues[0].name].sh,
				view: (<LeagueTable league={leagues[0]} team={team} />)
			});
		}
			
		var i, cup;
		
		for (i = 0; i < this.props.data.cups.length; i++) {
			cup = this.props.data.cups[i];
		
			views.push({
				name: competitions[cup.name].name,
				sh: competitions[cup.name].sh,
				view: (<Cup cup={cup} team={team} />)
			});
		}

		return views;
	}
}
