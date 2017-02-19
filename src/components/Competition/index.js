import React, { Component } from 'react';

import './style.css';

export default class Competition extends Component {

	render() {

		var compName;

		switch (this.props.name) {
			case 'FA Community Shield':
				compName = 'FA CS';
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
		round = round.replace(/Group.*$/, 'group');
		round = round.replace(/Round of 32/, 'R32');
		round = round.replace(/Round of 16/, 'R16');
		round = round.replace(/Quarter-finals/, 'R8');
		round = round.replace(/Semi-finals/, 'R4');

		var roundStyle;
		if (round === 'group') {
			roundStyle = 'condensed';
		}

		return (
			<div className="Competition">
				<div className="comp-name">{compName}</div>
				<div className={"round " + roundStyle}>{round}</div>
			</div>
		);
	}
}
