import React, { Component } from 'react';

import './style.css';

import {teams} from '../data';

export default class Team extends Component {

	render() {

		var logoID = 2608043;
		var name = this.props.name;

		if (teams[name] !== undefined) {
			logoID = teams[name].id;
			name = teams[name].name;
		}

		var imgSrc = 'http://img.uefa.com/imgml/TP/teams/logos/50x50/' + logoID + '.png';

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
