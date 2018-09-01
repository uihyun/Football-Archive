import React, { Component } from 'react';

import './style.css';

import { Cup, LeagueTable, PageSelector } from '../Common';
import { competitions } from '../data';

export default class Standings extends Component {
	
	render() {
		const [views, rows] = this.getViews();

		return (
			<div>
				<PageSelector views={views} expand={true} rows={rows} basename={this.props.basename} />
			</div>
		);
	}

	getViews() {
		const data = this.props.data.data;
		const leagues = data.leagues;
		const team = this.props.data.team;

		var views = [];
		var rows = [];
		var view;

		if (leagues[0]) {
			view = {
				name: competitions[leagues[0].name].name,
				sh: competitions[leagues[0].name].sh,
				link: '/league',
				component: LeagueTable,
				data: { league: leagues[0], team: team }
			};

			views.push(view);
			rows.push(1);
		}
			
		var i, j, competition, cup;
		var name, sh;

		for (i in competitions) {
			if (i) {
				for (j = 0; j < data.cups.length; j++) {
					cup = data.cups[j];

					if (i === cup.name) {
						competition = competitions[i];
						name = competition.name;
						sh = competition.sh;

						if (this.props.data.showYear) {
							name += ' ' + cup.season;
							sh += ' ' + cup.season;
						}

						views.push({
							name: name, sh: sh, link: '/' + sh, component: Cup,
							data: { cup: cup, team: team } });
					}
				}
			}
		}
			
		rows.push(views.length);

		return [views, rows];
	}
}
