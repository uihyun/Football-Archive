import React, { Component } from 'react';

import './style.css';

import {teams} from '../data';

import UrlUtil from '../../../util/url';

export default class Team extends Component {

	render() {

		var name = this.props.name;
		var imgSrc = UrlUtil.getEmblemUrl(name);

		if (teams[name] !== undefined) {
			name = teams[name].name;
		}

		if (this.props.emblemLarge) {
			return <img src={imgSrc} className="Team-emblem-large" alt="" />;
		}

		if (this.props.emblemSmall) {
			return <img src={imgSrc} className="Team-emblem-small" alt="" />;
		}
		
		return (
			<div className="Team flex-container">
				<img src={imgSrc} className="Team-emblem-small" alt="" />
				{ this.props.hideMobileName ||
					<div className="show-mobile flex-1">{name}</div>
				}
				<div className="hide-mobile flex-1">
					{ this.props.showShortName ? name : this.props.name }
				</div>
			</div>
		);
	}
}
