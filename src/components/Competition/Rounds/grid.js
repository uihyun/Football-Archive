import React, { Component } from 'react';

import './style.css';

import { Grid } from '../../Common';

export default class RoundsGrid extends Component {

	render() {
		const data = this.props.data;

		return (
			<div>
				<br/>
				<Grid matches={data.matches} year={data.year} />
			</div>
		);
	}
}
