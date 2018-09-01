import React, { Component } from 'react';

import './style.css';

import { Grid } from '../../Common';

export default class RoundsFinals extends Component {

	render() {
		const finals = this.props.data.finals;

		return (
			<div>
				<div className="flex-container">
					<div className="flex-1" />
					<div className="flex-2">
						{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Final'))}
					</div>
					<div className="flex-1">
						{this.getFinalRoundView(this.getFinalByRoundName(finals, '3/4'))}
					</div>
				</div>
				{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Semi-finals'))}
				{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Quarter-finals'))}
			</div>
		);
	}
	
	getFinalRoundView(round) {
		if (round === null)
			return null;
			
		var style = {
			height: '32px',
			fontSize: '1.5em',
			textAlign: 'center'
		};

		if (round.name === '3/4') {
			style.lineHeight = '32px';
			style.fontSize = '1.2em';
		}
		
		return (
			<div>
				<div style={style}>{round.name}</div>
				<Grid matches={round.group} year={this.props.data.year} noFiller={true} />
			</div>
		);
	}

	getFinalByRoundName(rounds, name) {
		var i, round;
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name === name)
				return round;
		}

		return null;
	}
}
