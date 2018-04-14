import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './style.css';

import Recent from '../Recent';

import {clubs} from '../data';

export default class Home extends Component {

	render() {
		return (
			<div className="Home">
				<div className="flex-container flex-container-space-evenly text-center">
					<div className="flex-1">
						<NavLink to={'/club/' + clubs.years.max} activeClassName="Home-selected">Clubs</NavLink>
					</div>
					<div className="flex-1">
						<NavLink to="/nation" activeClassName="Home-selected">Nations</NavLink>
					</div>
					<div className="flex-1 Home-not-yet">Aggregate</div>
				</div>
				<Recent />
			</div>
		);
	}
}
