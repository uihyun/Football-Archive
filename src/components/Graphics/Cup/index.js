import React, { Component } from 'react';

import './style.css';

import KnockOutStage from './KnockOutStage';
import GroupStage from './GroupStage';

export default class Cup extends Component {

	render() {
		const cup = this.props.cup;
		const team = this.props.team;
		const size = 350;

		return (
			<div className="Cup">
				<h3 className="text-center">{cup.name}</h3>
				<div className="Cup-flex-container">
					<KnockOutStage cup={cup} team={team} size={size} />
				</div>
				<div className="Cup-flex-container">
					<GroupStage cup={cup} team={team} size={size} />
				</div>
			</div>
		);
	}
}
