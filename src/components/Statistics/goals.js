import React, { Component } from 'react';

import './style.css';

import { PlayerName } from '../Common';

export default class StatisticsGoals extends Component {

	render() {
		const goals = this.props.data;

		return (
			<div className="Statistics-item">
				<h3>
					Goals <small>({goals.length} players)</small>
				</h3>
				{goals.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className="Statistics-backnumber text-center">
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{player.goalMatches.length}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
