import React, { Component } from 'react';

import './style.css';

export default class SeasonSummary extends Component {

	constructor(props) {
		super(props);
		this.state = { player: null };
		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.squad !== nextProps.squad) {
			this.setState({ player: null });
		}
	}

	render() {
		return (
			<div className="flex-container flex-container-wrap">
				{this.props.squad.map(player => {
					var backnumberStyle = 'Squad-inner Squad-backnumber';
					var playerNameStyle = 'Squad-inner Squad-player-name';

					if (this.state.player &&
							player.fullname === this.state.player.fullname) {
						backnumberStyle += ' Squad-backnumber-selected';
						playerNameStyle += ' Squad-player-name-selected';
					}

					return (
						<div className="flex-container Squad-member" key={player.fullname} onClick={() => this.selectPlayer(player)}>
							<div className={backnumberStyle}>{player.number}</div>
							<div className={playerNameStyle}>{player.name}</div>
						</div>
					);
				})}
			</div>
		);
	}

	selectPlayer(player) {
		var newPlayer = null;

		if (this.state.player === null ||
				this.state.player.fullname !== player.fullname) {
			newPlayer = player;
		}

		this.setState({ player: newPlayer });
		if (this.props.selectPlayer) {
			this.props.selectPlayer(newPlayer);
		}
	}
}
