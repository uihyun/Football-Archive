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

		if (comp.code === 'WQ') {
			round = round.replace(/2ndR/, '2R');
			round = round.replace(/3rdR/, '3R');
			round = round.replace(/Relegation/, '4R');
			round = round.replace(/Matches/, 'Play-offs');
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
