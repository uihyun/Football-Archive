import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {teams} from '../data';

import UrlUtil from '../../../util/url';

export default class Team extends Component {

	render() {
		var team = this.props.team;
		var name = (teams[team] !== undefined) ? teams[team].name : team;
		var imgSrc = UrlUtil.getEmblemUrl(team);

		var inside = null;

		if (this.props.emblemLarge) {
			inside = <img src={imgSrc} className="Team-emblem-large" alt="" />;
		} else if (this.props.emblemSmall) {
			inside = <img src={imgSrc} className="Team-emblem-small" alt="" />;
		} else {
			inside = (
				<div className="Team flex-container">
					<img src={imgSrc} className="Team-emblem-small" alt="" />
					{ this.props.hideMobileName ||
						<div className="show-mobile flex-1">{name}</div>
					}
					<div className="hide-mobile flex-1">
						{ this.props.showShortName ? name : team }
					</div>
				</div>
			);
		}

		var link = UrlUtil.getLink(this.props.year, team);

		if (link) {
			return (
				<Link to={link}>
					{inside}
				</Link>
			);
		}

		return inside;
	}
}
