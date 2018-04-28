import React, { Component } from 'react';

import './style.css';

import {Progress} from '../../Common';

import {competitions} from '../data';

export default class Summary extends Component {

	constructor(props) {
		super(props);
		
		this.state = this.newState(this.props);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

  render() {
		const team = this.props.team;
		const year = this.props.year;
		const player = this.props.player;

		return (
			<div className="Summary">
				<div className="flex-container">
					{this.state.groups.map((group, index) => {
						return (
							<div key={index} className="flex-1">
								{group.map(comp => {
									const leagueTable = this.state.leagueTableMap[comp.name];
									const cup = this.state.cupMap[comp.url];
									return <Progress key={comp.name} team={team} year={year} player={player}
														competition={comp} leagueTable={leagueTable} cup={cup} />;
								})}
							</div>
						);
					})}
				</div>
			</div>
		);
  }
	
	newState(props) {
		const data = props.data;
		var state = { groups: [], leagueTableMap: {}, cupMap: {} };

		if (data.leagues === undefined) {
			return state; // data not yet fetched
		}

		var i, j, league, cup;
		var comp, group;

		for (i = 0; i < data.leagues.length; i++) {
			league = data.leagues[i];
			state.leagueTableMap[league.name] = league.table;
		}

		for (i = 0; i < data.cups.length; i++) {
			cup = data.cups[i];
			state.cupMap[cup.url] = cup;
		}

		for (i in competitions) {
			if (i) {
				group = competitions[i].group;

				if (state.groups[group] === undefined) {
					state.groups[group] = [];
				}

				for (j = 0; j < data.competitions.length; j++) {
					comp = data.competitions[j];

					if (comp.name !== i)
						continue;

					state.groups[group].push(comp);
				}
			}
		}

		return state;
	}
}
