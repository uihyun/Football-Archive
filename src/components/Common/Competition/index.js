import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { competitions, rounds } from '../data';

import UrlUtil from '../../../util/url';

export default class Competition extends Component {

	render() {
		var comp = competitions[this.props.name];

		if (comp === undefined)
			return <b>{this.props.name}</b>;

		var name = comp.name;
		var sh = comp.sh;
		var round = this.props.round.replace(/ Round/, 'R');
		var shRound = rounds.getShortForm(this.props.name, round);

		round = ' ' + round;

		if (sh === 'Fr') {
			round = '';
			shRound = '';
		}

		if (sh === 'WCQ') {
			round = round.replace(/2ndR/, '2R');
			round = round.replace(/3rdR/, '3R');
			round = round.replace(/Relegation/, '4R');
			shRound = shRound.replace(/2ndR/, '2R');
			shRound = shRound.replace(/3rdR/, '3R');
			shRound = shRound.replace(/Relegation/, '4R');
		}

		if (name === 'J League Cup') {
			round = round.replace(/Zwischenrunde/, 'Play-off');
		}
			
		round = round.replace(/Matches/, '');

		if (this.props.showFull)
			sh = name;

		const link = UrlUtil.getCompLink(this.props.year, comp.name);
		var span = (
			<span>
				<span className="hide-mobile">{name} {round}</span>
				<span className="show-mobile">{sh} {shRound}</span>
			</span>
		);

		if (link) {
			span = <Link to={link}>{span}</Link>;
		}

		return span;
	}
}
