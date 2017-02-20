import React, { Component } from 'react';

import './style.css';

import teams from '../../data/teams';

export default class Team extends Component {

	render() {

		var logoID = 2608043;
		var name = this.props.name;

		if (teams[name] !== undefined) {
			logoID = teams[name].id;
			name = teams[name].name;
		}

		var imgSrc = 'http://img.uefa.com/imgml/TP/teams/logos/50x50/' + logoID + '.png';
		
		return (
			<div className="Team">
				<img src={imgSrc} className="logo" alt="" />
				{name}
			</div>
		);
	}
}
