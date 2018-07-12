import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './style.css';

import Recent from '../Recent';

import { clubs, kleague } from '../data';

export default class Home extends Component {

	render() {
		const style = { lineHeight: '30px' }
		return (
			<div className="Home">
				<div className="flex-container flex-container-space-evenly text-center" style={style}>
					<div className="flex-1">
						<NavLink to="/FIFA">FIFA</NavLink>
					</div>
					<div className="flex-1">
						<NavLink to={'/UEFA/' + clubs.years.max}>UEFA</NavLink>
					</div>
					<div className="flex-1">
						<NavLink to={'/AFC/' + kleague.years.max}>AFC</NavLink>
					</div>
					<div className="flex-1">
						<NavLink to={'/competition/' + clubs.years.max}>
							<span className="hide-mobile">Competitions</span>
							<span className="show-mobile">Comp</span>
						</NavLink>
					</div>
					<div className="flex-1">
						<NavLink to={'/rankings/' + clubs.years.max}>Rankings</NavLink>
					</div>
				</div>
				<Recent />
			</div>
		);
	}
}
