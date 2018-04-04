import React, { Component } from 'react';

import './style.css';

import {Squad, Progress} from '../Common';

import {competitions} from '../data';

export default class Summary extends Component {

	constructor(props) {
		super(props);
		
		this.state = this.newState(this.props);

		this.selectPlayer = this.selectPlayer.bind(this);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

	selectPlayer(player) {
		this.setState({ player: player });
	}

  render() {
		const team = this.props.team;
		const year = this.props.year;

		return (
			<div className="Summary">
				<div className="flex-container">
					{this.state.groups.map((group, index) => {
						return (
							<div key={index} className="flex-1">
								{group.map(comp => {
									var leagueTable = this.state.leagueTableMap[comp.name];
									return <Progress key={comp.name} team={team} year={year} player={this.state.player}
														competition={comp} leagueTable={leagueTable} />;
								})}
							</div>
						);
					})}
				</div>
				<br/>
				<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
			</div>
		);
  }
	
	newState(props) {
		const data = props.data;
		var state = { groups: [], leagueTableMap: {}, player: null };

		if (data.leagues === undefined) {
			return state; // data not yet fetched
		}

		var i, league;
		var compMap = {};
		var comp, name, entry, group;

		for (i = 0; i < data.leagues.length; i++) {
			league = data.leagues[i];
			state.leagueTableMap[league.name] = league.table;
		}
		
		for (i in competitions) {
			if (i) {
				compMap[i] = {name: i, matches: [], group: competitions[i].group};
			}
		}

		for (i = 0; i < data.competitions.length; i++) {
			comp = data.competitions[i];
			name = comp.name.replace(/ Qual.$/, '');
			entry = compMap[name];
			entry.matches = entry.matches.concat(comp.matches);
		}
		
		for (i in compMap) {
			if (compMap[i] && compMap[i].matches.length > 0) {
				group = compMap[i].group;

				if (state.groups[group] === undefined) {
					state.groups[group] = [];
				}

				state.groups[group].push(compMap[i]);
			}
		}

		return state;
	}
}
