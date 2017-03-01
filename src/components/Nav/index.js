import React, { Component } from 'react';
import { Link } from 'react-router';

import './style.css';

export default class Nav extends Component {

	render() {

		return (
			<div className="Nav">
				<h1>
					Football Archive
				</h1>
				<ul>
					<li><Link to="/pl-teams" activeClassName="Nav-active">Seasons</Link></li>
				</ul>
				<ul>
					<li><Link to="/manage" activeClassName="Nav-active">Manage</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
}
