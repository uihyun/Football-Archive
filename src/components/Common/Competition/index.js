import React, { Component } from 'react';

import './style.css';

import {competitions} from '../data';

export default class Competition extends Component {

	render() {

		var comp = competitions[this.props.name];
		var round = ' ' + this.props.round.replace(/ Round/, 'R');

		if (comp.code === 'F') {
			round = '';
		}

		return (
			<span>
				<span className="hide-mobile">{comp.name}</span>
				<span className="show-mobile">{comp.sh}</span>
				{round}
			</span>
		);
	}
}
