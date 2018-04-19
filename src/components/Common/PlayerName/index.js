import React, { Component } from 'react';

import './style.css';

import PlayerNameUtil from '../../../util/playerName';

export default class PlayerName extends Component {

	render() {
		const player = this.props.player;

		return this.getStylizedName(player);
	}

	insertHardHyphen(string) {
		let index = string.indexOf('-');

		if (index >= 0) {
			return <span>{string.substr(0, index)}&#8209;{string.substr(index + 1)}</span>
		} else {
			return string;
		}
	}

	getStylizedName(player) {
		let name = PlayerNameUtil.divide(player);

		if (name.first === '') {
			return <b>{this.insertHardHyphen(name.last)}</b>;
		} else {
			return <span>{this.insertHardHyphen(name.first)} <b>{this.insertHardHyphen(name.last)}</b></span>;
		}
	}
}
