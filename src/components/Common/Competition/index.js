import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {competitions} from '../data';

import UrlUtil from '../../../util/url';

export default class Competition extends Component {

	render() {
		var comp = competitions[this.props.name];
		var name = comp.name;
		var sh = comp.sh;
		var round = ' ' + this.props.round.replace(/ Round/, 'R');

		if (sh === 'Fr') {
			round = '';
		}

		if (sh === 'WCQ') {
			round = round.replace(/2ndR/, '2R');
			round = round.replace(/3rdR/, '3R');
			round = round.replace(/Relegation/, '4R');
		}
			
		round = round.replace(/Matches/, '');

		if (this.props.showFull)
			sh = name;

		const link = UrlUtil.getCompLink(this.props.year, comp.name);
		var span = (
			<span>
				<span className="hide-mobile">{name}</span>
				<span className="show-mobile">{sh}</span>
				{round}
			</span>
		);

		if (link) {
			span = <Link to={link}>{span}</Link>;
		}

		return span;
	}
}
