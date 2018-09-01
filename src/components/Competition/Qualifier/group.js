import React, { Component } from 'react';

import './style.css';

import { Cup } from '../../Common';

import Groups from '../Groups';

export default class CupViewGroup extends Component {

	render() {
		const round = this.props.data.round;
		const qual = this.props.data.qual;
		const group = this.props.data.group;

		return (
			<div>
				<Cup cup={round} onlyGroup={true} />
				<br/>
				<Groups comp={qual} groups={group} basename={this.props.data.basename} />
			</div>
		);
	}
}
