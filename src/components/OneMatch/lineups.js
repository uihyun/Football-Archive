import React, { Component } from 'react';

import { PageSelector } from '../Common';

import Lineup from './Lineup'

import { teams } from '../data';

export default class Lineups extends Component {
	
	render() {
		const match = this.props.data.summary;
		var views = [
			{ name: match.l, sh: this.getShortName(match.l), link: '/l', component: Lineup,
				data: { summary: match, side: 'l'} },
			{ name: match.r, sh: this.getShortName(match.r), link: '/r', component: Lineup,
				data: { summary: match, side: 'r'} },
		];

		return (
			<div className="Lineup">
				<PageSelector views={views} expand={true} />
				<br/>
			</div>
		);
	}

	getShortName(team) {
		if (teams[team])
			return teams[team].name;

		return team;
	}
}
