import React, { Component } from 'react';

import './style.css';

export default class Match extends Component {

	render() {
		const players = this.props.players;

		return (
			<div className="Lineup">
				{players.start.map(player => {
					return <div className="Player flex-1 start" key={player.number}>
						{player.number}
					</div>
				})}
				{players.sub.map(player => {
					return <div className={"Player flex-1 " + (player.sub ? 'sub' : '')} key={player.number}>
						{player.number}
					</div>
				})}
			</div>
		);
	}
}
