import React, { Component } from 'react';

import './style.css';

import teams from '../../data/teams';

export default class Team extends Component {

	render() {

		var logoID = 2608043;
		var name = this.props.name;

		if (teams[name] !== undefined) {
			logoID = teams[name].id;
			name = teams[name].name;
		}

		var imgSrc = 'http://img.uefa.com/imgml/TP/teams/logos/50x50/' + logoID + '.png';
		
		return (
			<div className="Team">
				<img src={imgSrc} className="Team-logo" alt="" />
				{ this.props.hideMobileName ||
					<span className="show-mobile">{name}</span>
				}
				<span className="hide-mobile">
					{ this.props.showShortName ? name : this.props.name }
				</span>
			</div>
		);
	}
}
