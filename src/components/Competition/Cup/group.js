import React, { Component } from 'react';

import './style.css';

import { Cup } from '../../Common';

import Groups from '../Groups';

export default class CupViewGroup extends Component {

	render() {
		const cup = this.props.data.cup;
		const group = this.props.data.group;

		return (
			<div>
				<Cup cup={cup} onlyGroup={true} />
				<br/>
				<Groups comp={cup} groups={group} basename={this.props.data.basename} />
			</div>
		);
	}
}
