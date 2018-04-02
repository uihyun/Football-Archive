import React, { Component } from 'react';

import './style.css';

import {teams} from '../data';

export default class EmblemLarge extends Component {

	render () {
		const team = this.props.team;
		var logoID = 2608043;
		if (teams[team] !== undefined) {
			logoID = teams[team].id;
		}

		var imgSrc = '/' + logoID + '.png';

		return (
			<img src={imgSrc} className="EmblemLarge" alt="" />
		);
	}
}
