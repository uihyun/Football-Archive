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
		const data = this.props.data;
		const leagues = data.leagues;
		const team = this.props.team;

		var views = [];

		if (leagues[0]) {
			views.push({
				name: competitions[leagues[0].name].name,
				sh: competitions[leagues[0].name].sh,
				view: (<LeagueTable league={leagues[0]} team={team} />)
			});
		}
			
		var i, j, competition, cup;

		for (i in competitions) {
			if (i) {
				for (j = 0; j < data.cups.length; j++) {
					cup = this.props.data.cups[j];

					if (i === cup.name) {
						competition = competitions[i];
						views.push({
							name: competition.name,
							sh: competition.sh,
							view: (<Cup cup={cup} team={team} />)
						});
						break;
					}
				}
			}
		}
		

		return views;
	}
}
