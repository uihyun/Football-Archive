import React, { Component } from 'react';
import { Link } from 'react-router';

import './style.css';

export default class Nav extends Component {

	render() {

		return (
			<div className="Nav">
				<Link className="Nav-link Nav-h1" to="/">Football Archive</Link>
				<Link className="Nav-link Nav-h2" to="/manage" activeClassName="Nav-active"> Manage</Link>
				{this.props.children}
			</div>
		);
	}
}
