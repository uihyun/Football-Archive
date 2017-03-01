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
					<li><Link to="/season" activeClassName="active">Seasons</Link></li>
				</ul>
				<ul>
					<li><Link to="/manage" activeClassName="active">Manage</Link></li>
				</ul>
				{this.props.children}
			</div>
		);
	}
}
