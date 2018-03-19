import React, { Component } from 'react';

import './style.css';

import PlayerName from '../../../util/playerName';

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
					var style = 'Squad-inner Squad-player-name';
					var name = player.shorthand;

					if (this.state.player &&
							player.fullname === this.state.player.fullname) {
						style += ' Squad-player-name-selected';
						name = PlayerName.fullname(player);
					}

					return (
						<div className="flex-container Squad-member" key={player.fullname} onClick={() => this.selectPlayer(player)}>
							<div className={style}>{name}</div>
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
