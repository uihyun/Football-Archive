import React, { Component } from 'react';

import './style.css';

import KnockOutStage from './KnockOutStage';
import GroupStage from './GroupStage';

export default class Cup extends Component {

	render() {
		var cup = this.props.cup;
		var team = this.props.team;

		if (this.props.data) {
			cup = this.props.data.cup;
			team = this.props.data.team;
		}

		const size = Math.min(350, window.innerWidth - 25);

		if (this.props.onlyGroup) {
			return (
			<div className="Cup">
				<div className="Cup-flex-container">
					<GroupStage cup={cup} team={team} size={size} />
				</div>
			</div>
			);
		}

		return (
			<div className="Cup">
				{this.props.hideName ||
					<h3 className="text-center">{cup.name}</h3>
				}
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
