import React, { Component } from 'react';

import './style.css';

import {teams} from '../data';

import UrlUtil from '../../../util/url';

export default class Team extends Component {

	render() {

		var name = this.props.name;

		if (teams[name] !== undefined) {
			name = teams[name].name;
		}

		var imgSrc = UrlUtil.getEmblemUrl(this.props.team);

		if (this.props.emblemOnly) {
			return <img src={imgSrc} className="Team-logo" alt="" />;
		}
		
		return (
			<div className="Team flex-container">
				<img src={imgSrc} className="Team-logo" alt="" />
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
