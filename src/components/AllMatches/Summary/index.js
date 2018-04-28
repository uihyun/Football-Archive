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
						if (group.length === 0)
							return null;

						return (
							<div key={index} className="flex-1">
								{group.map(comp => {
									const leagueTable = this.state.leagueTableMap[comp.name];
									const cup = this.state.cupMap[comp.url];
									return <Progress key={comp.url} team={team} year={year} player={player}
														competition={comp} leagueTable={leagueTable} cup={cup} 
														showYear={this.props.showYear} />;
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

		if (this.props.showYear) {
			var maxDate = {};
			var match, max, date, array;

			for (i = 0; i < data.competitions.length; i++) {
				comp = data.competitions[i];
				max = 0;
				
				for (j = 0; j < comp.matches.length; j++) {
					match = comp.matches[j];
					array = match.date.split('/');
					date = parseInt(array[2] + array[0] + array[1], 10); // mm/dd/yyyy -> yyyymmdd
					max = Math.max(max, date);
				}

				maxDate[comp.url] = max;
			}

			for (i = 0; i < state.groups.length; i++) {
				group = state.groups[i];

				if (group) {
					group.sort((a, b) => { return maxDate[b.url] - maxDate[a.url]; });
				}
			}
		}

		console.log(state.groups);

		return state;
	}
}
