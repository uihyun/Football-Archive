import React, { Component } from 'react';

import './style.css';

import { PlayerName } from '../Common';

export default class StatisticsAssists extends Component {

	render() {
		const assists = this.props.data;

		return (
			<div className="Statistics-item">
				<h3>
					Assists <small>({assists.length} players)</small>
				</h3>
				{assists.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className="Statistics-backnumber text-center">
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{player.assistMatches.length}
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
