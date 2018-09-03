import React, { Component } from 'react';

import './style.css';

import {Squad, PageSelector} from '../Common';

import Timeline from './Timeline';
import Form from './Form';
import Rotation from './Rotation';
import Summary from './Summary';
import Circle from './Circle';

import SquadUtil from '../../util/squad';

export default class AllMatches extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			squad: SquadUtil.getSquadArray(this.props.data.data),
			player: null
		};
		
		this.selectPlayer = this.selectPlayer.bind(this);
	}
	
	componentWillReceiveProps(props) {
		this.setState({squad: SquadUtil.getSquadArray(props.data.data), player: null});
	}

	render() {
		return (
			<div className="AllMatches">
				<PageSelector views={this.getViews()} basename={this.props.basename} />
				<br/>
				<Squad squad={this.state.squad} selectPlayer={this.selectPlayer} />
			</div>
		);
	}
	
	selectPlayer(player) {
		this.setState({ player: player });
	}
	
	getViews() {
		const data = this.props.data.data;
		const downData = {
			data: data,
			squad: this.state.squad,
			team: data.team,
			year: data.season,
			player: this.state.player,
			showYear: this.props.data.showSummaryYear
		};

		var views = [];

		if (this.props.data.showForm) {
			views.push({ name: 'Form', link: '/form', component: Form, data: downData });
			views.push({ name: 'Rotation', link: '/rotation', component: Rotation, data: downData });
		}
		views.push({
			name: 'Summary', link: '/summary', component: Summary, data: downData });
		views.push({
			name: 'Circle', link: '/circle', component: Circle, data: downData });
		views.push({
			name: 'Timeline', link: '/timeline', component: Timeline, data: downData });

		return views;
	}
}
