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
			case 'Europa League':
				compName = 'Europa';
				break;
			case 'League Cup':
				compName = 'LC';
				break;
			default:
				compName = this.props.name;
				break;
		}

		var round = this.props.round;

		round = round.replace(/ Round/, 'R');

		if (compName === 'Community Shield') {
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
