import React, { Component } from 'react';

import './style.css';

import { PlayerName } from '../Common';

export default class StatisticsAppearances extends Component {

	render() {
		const appearances = this.props.data;

		return (
			<div className="Statistics-item">
				<h3>
					Appearances <small>({appearances.length} players)</small>
				</h3>
				{appearances.map(player => {
					return (
						<div key={player.name} className="flex-container Statistics-row">
							<div className={"Statistics-backnumber text-center" + (player.sub ? " Statistics-backnumber-sub" : "")}>
								{player.number}
							</div>
							<div className="Statistics-name flex-1">
								<PlayerName player={player.name} />
							</div>
							<div className="Statistics-value text-right">
								{
									player.startMatches.length > 0 &&
									player.startMatches.length
								}
							</div>
							<div className="Statistics-value text-right">
								{
									player.subMatches.length > 0 &&
									<small>{player.subMatches.length}</small>
								}
							</div>
							<div className="Statistics-value-long text-right">
								{player.minutes}'
							</div>
						</div>
					);
				})}
			</div>
		);
	}
}
