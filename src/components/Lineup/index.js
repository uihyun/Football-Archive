import React, { Component } from 'react';

import './style.css';

export default class Lineup extends Component {

	render() {
		const players = this.props.players;
		var blank = [];

		if (players.sub.length < 7) {
			for (var i = 0; i < 7 - players.sub.length; i++) {
				blank.push({number: i});
			}
		}

		return (
			<div className="Lineup">
				{players.start.map(player => {
					var playerClass = 'Lineup-start';

					if (this.props.selectedPlayer &&
							player.number === this.props.selectedPlayer.number) {
						playerClass += '-selected';
					}

					return <div className={"Lineup-Player flex-1 " + playerClass} key={player.number}
									onClick={() => this.props.selectPlayer(player)}>
						{player.number}
					</div>
				})}
				{players.sub.map(player => {
					var playerClass = player.sub ? 'Lineup-sub' : 'Lineup-bench';
						
					if (this.props.selectedPlayer &&
							player.number === this.props.selectedPlayer.number) {
						playerClass += '-selected';
					}

					return <div className={"Lineup-Player flex-1 " + playerClass} key={player.number}
									onClick={() => this.props.selectPlayer(player)}>
						{player.number}
					</div>
				})}
				{blank.map(player => {
					return <div className="Lineup-Player flex-1" key={player.number}></div>
				})}
			</div>
		);
	}
}
