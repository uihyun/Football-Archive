import React, { Component } from 'react';

import './style.css';

import { colors } from '../data';

export default class Goal extends Component {

	constructor(props) {
		super(props);
		
		const size = this.props.size ? this.props.size : 20;
		const center = size / 2;
		const radius = [center * 0.8, center * 0.5, center * 0.3];
		const color = this.props.og ? colors.red : 'black';
		const angles = this.getAngles();

		this.state = {
			size: size,
			center: center,
			radius: radius,
			color: color,
			angles: angles
		};
	}

	render() {
		const size = this.state.size;
		const center = this.state.center;
		const radius = this.state.radius[0];
		const color = this.state.color;

		return (
			<svg width={size} height={size}>
				<circle cx={center} cy={center} r={radius} strokeWidth="1" stroke={color} fill="none" />
				{this.getPentagon(size)}
				{this.getTriangles(size)}
				{this.getLines(size)}
			</svg>
		);
	}

	getAngles() {
		const dTheta = 2 * Math.PI / 5;
		const thetaOffset = Math.PI / -2;
		var angles = [];
		var i;

		for (i = 0; i < 5; i++) {
			angles.push(dTheta * i + thetaOffset);
		}

		return angles;
	}

	getPoint(center, radius, angle) {
		var point = '';
		point += Math.cos(angle) * radius + center + ',';
		point += Math.sin(angle) * radius + center + ' ';
		return point;
	}

	getTriangle(angle) {
		const center = this.state.center;
		const color = this.state.color;
		const outerR = this.state.radius[0];
		const innerR = this.state.radius[1];;
		const offset = Math.PI / 7.5;
		var points = '';

		points += this.getPoint(center, innerR, angle);
		points += this.getPoint(center, outerR, angle - offset);
		points += this.getPoint(center, outerR, angle);
		points += this.getPoint(center, outerR, angle + offset);

		return (<polygon key={angle} points={points} fill={color} />);
	}

	getTriangles() {
		const angles = this.state.angles;
		var triangles = [];
		var i;

		for (i = 0; i < angles.length; i++) {
			triangles.push(this.getTriangle(angles[i]));
		}

		return triangles;
	}

	getLines() {
		const angles = this.state.angles;
		const center = this.state.center;
		const radius = this.state.radius[0];
		const color = this.state.color;
		
		var lines = [];
		var angle, x2, y2;
		var i;
		
		for (i = 0; i < angles.length; i++) {
			angle = angles[i];
			x2 = Math.cos(angle) * radius + center;
			y2 = Math.sin(angle) * radius + center;
			lines.push(<line key={i} x1={center} y1={center} x2={x2} y2={y2} stroke={color} strokeWidth="0.5" />);
		}

		return lines;
	}

	getPentagon() {
		const angles = this.state.angles;
		const center = this.state.center;
		const radius = this.state.radius[2];
		
		var i, points = '';

		for (i = 0; i < angles.length; i++) {
			points += this.getPoint(center, radius, angles[i]);
		}

		return (<polygon points={points} fill={this.state.color} />);
	}
}
