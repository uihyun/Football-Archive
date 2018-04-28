import React, { Component } from 'react';

import './style.css';

import {Squad, ViewSelector} from '../Common';

import Timeline from './Timeline';
import Form from './Form';
import Summary from './Summary';
import Circle from './Circle';

import SquadUtil from '../../util/squad';

export default class AllMatches extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			squad: SquadUtil.getSquadArray(this.props.data),
			player: null
		};
		
		this.selectPlayer = this.selectPlayer.bind(this);
	}
	
	componentWillReceiveProps(props) {
		this.setState({squad: SquadUtil.getSquadArray(props.data), player: null});
	}

	render() {
		return (
			<div className="AllMatches">
				<ViewSelector views={this.getViews()} />
				<br/>
				<Squad squad={this.state.squad} selectPlayer={this.selectPlayer} />
			</div>
		);
	}
	
	selectPlayer(player) {
		this.setState({ player: player });
	}
	
	getViews() {
		const data = this.props.data;
		const squad = this.state.squad;
		const team = this.props.team;
		const year = this.props.year;
		const player = this.state.player;

		var views = [];

		if (this.props.showForm) {
			views.push({
				name: 'Form',
				view: (<Form data={data} squad={squad} team={team} year={year} player={player} />)
			});
		}
		views.push({
			name: 'Summary',
			view: (<Summary data={data} squad={squad} team={team} year={year} player={player} 
							showYear={this.props.showSummaryYear} />)
		});
		views.push({
			name: 'Circle',
			view: (<Circle data={data} squad={squad} team={team} year={year} player={player} />)
		});
		views.push({
			name: 'Timeline',
			view: (<Timeline data={data} squad={squad} team={team} year={year} player={player} />)
		});

		return views;
	}
}
