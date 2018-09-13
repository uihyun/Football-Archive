import React, { Component } from 'react';

import './style.css';

import { Cup } from '../../Common';

export default class QualificationViewNationsLeague extends Component {

	render() {
		const rounds = this.props.data.rounds;
		const headerStyle = {
			fontSize: '1.2em',
			margin: '10px',
		};

		return (
			<div>
				{rounds.map(round =>
					<div key={round.name}>
						<div className="text-center" style={headerStyle}>Nations League {round.name}</div>					
						<Cup cup={round} onlyGroup={true} />
					</div>
				)}
			</div>
		);
	}
}
