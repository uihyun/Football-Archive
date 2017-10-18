import React, { Component } from 'react';

import './style.css';

export default class Competition extends Component {

	render() {

		var compName;

		switch (this.props.name) {
			case 'FA Community Shield':
				compName = 'Community Shield';
				break;
			case 'Premier League':
				compName = 'EPL';
				break;
			case 'League Cup':
				compName = 'EFL Cup';
				break;
			case 'Primera División':
				compName = 'La Liga';
				break;
			case 'Champions League':
			case 'Champions League Qual.':
				compName = 'Champs';
				break;
			case 'Europa League':
			case 'Europa League Qual.':
				compName = 'Europa';
				break;
			case 'Club World Cup':
				compName = 'CWC';
				break;
			default:
				compName = this.props.name;
				break;
		}

		var round = this.props.round;

		round = round.replace(/ Round/, 'R');

		if (compName === 'Community Shield' ||
				compName === 'Supercopa') {
			round = '';
		} else {
			round = ' ' + round;
		}

		return (
			<span>
				{compName}{round}
			</span>
		);
	}
}
