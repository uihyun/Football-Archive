import React, { Component } from 'react';

import './style.css';

export default class Assist extends Component {

	constructor(props) {
		super(props);
		
		const size = this.props.size ? this.props.size : 20;
		const center = size / 2;
		const radius = center * 0.8 + 1;
		
		this.state = {
			size: size,
			center: center,
			radius: radius
		};
	}

	render() {
		const size = this.state.size;
		const center = this.state.center;
		const radius = this.state.radius;
		
		var style = {
			fill: 'white',
			alignmentBaseline: 'middle',
			textAnchor: 'middle',
			fontSize: size * 0.7,
		};
		
		return (
			<svg width={size} height={size}>
				<circle cx={center} cy={center} r={radius} fill="gray" />
				<text x={center} y={center} style={style}>a</text>
			</svg>
		);
	}
}
