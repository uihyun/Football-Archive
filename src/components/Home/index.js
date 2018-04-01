import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './style.css';

export default class Home extends Component {

	render() {
		return (
			<div className="Home flex-container flex-container-space-evenly text-center">
				<div className="flex-1">
					<NavLink to="/club" activeClassName="Home-selected">Clubs</NavLink>
				</div>
				<div className="flex-1 Home-not-yet">Countries</div>
				<div className="flex-1 Home-not-yet">Aggregate</div>
				<div className="flex-1">
					<NavLink to="/manage" activeClassName="Home-selected">Manage</NavLink>
				</div>
			</div>
		);
	}
}
