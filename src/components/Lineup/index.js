import React, { Component } from 'react';

import './style.css';

export default class Match extends Component {

	render() {
		const players = this.props.players;

		return (
			<div className="Lineup">
				{players.start.map(player => {
					var playerClass = 'start';

					if (player.number === this.props.selectedPlayer.number) {
						playerClass += '-selected';
					}

					return <div className={"Player flex-1 " + playerClass} key={player.number}
									onClick={() => this.props.selectPlayer(player)}>
						{player.number}
					</div>
				})}
				{players.sub.map(player => {
					var playerClass = player.sub ? 'sub' : 'none';
						
					if (player.number === this.props.selectedPlayer.number) {
						playerClass += '-selected';
					}

					return <div className={"Player flex-1 " + playerClass} key={player.number}
									onClick={() => this.props.selectPlayer(player)}>
						{player.number}
					</div>
				})}
			</div>
		);
	}
}
