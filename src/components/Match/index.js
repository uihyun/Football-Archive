import React, { Component } from 'react';

import './style.css';

export default class Match extends Component {
	render() {
		const match = this.props.match;
		const dateA = match.date.split('/');
		const mm = dateA[0];
		const dd = dateA[1];

		return (
			<div className="Match">
				{mm}/{dd} vs {match.vs} <small>({match.competition})</small>
			</div>
		);
	}
}
