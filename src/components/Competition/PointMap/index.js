import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { colors } from '../data';

import UrlUtil from '../../../util/url';

export default class PointMap extends Component {

	constructor(props) {
		super(props);
		
		const [min, max] = this.getMinMax(props.league.table);

		this.state = {
			min: min,
			max: max,
			size: 350,
			inset: 20,
			imageSize: 40,
		};
		
	}

	componentWillReceiveProps(nextProps) {
		const [min, max] = this.getMinMax(nextProps.league.table);
		
		this.setState({ min: min, max: max });
	}

	render() {
		const size = this.state.size;
		const axis = this.getAxis();
		const teams = this.getTeams();

		return (
			<div className="flex-container flex-container-center">
				<svg width={size} height={size}>
					{axis}
					{teams}
				</svg>
			</div>
		);
	}

	getMinMax(table) {
		var min = 1000;
		var max = 0;
		var i, team;

		for (i = 0; i < table.length; i++) {
			team = table[i];
			min = Math.min(min, team.points);
			max = Math.max(max, team.points);
		}

		return [Math.floor(min / 10) * 10, Math.ceil(max / 10) * 10];
	}

	getY(point) {
		const min = this.state.min;
		const max = this.state.max;
		const size = this.state.size;
		const inset = this.state.inset;
			
		return (max - point) / (max - min) * (size - inset * 2) + inset;
	}

	getAxis() {
		const min = this.state.min;
		const max = this.state.max;
		const size = this.state.size;
		const inset = this.state.inset;

		var style = {
			text: {
				fill: colors.gray,
				alignmentBaseline: 'middle',
				textAnchor: 'end',
				fontSize: '1.5em'
			},
			line: {
				stroke: colors.lightgray,
				strokeWidth: '2px'
			}
		};

		var axis = [];
		var i;
		const x = inset * 2;
		var y;

		for (i = min; i <= max; i += 10) {
			y = this.getY(i);
			axis.push(<text key={'axisText' + i} x={x} y={y} style={style.text}>{i}</text>);
			axis.push(<line key={'axisLine' + i} x1={x + 5} y1={y} x2={size} y2={y} style={style.line} />);
		}

		return axis;
	}
	
	getX(index) {
		const table = this.props.league.table;

		if (table.length === 18)
			return (index % 6) / 6;
		
		if (index < 6) {
			return (index + 0.5) / 7;
		} else {
			return ((index - 6) % 7) / 7;
		}
	}
	
	getTeams() {
		const size = this.state.size;
		const inset = this.state.inset;
		const imageSize = this.state.imageSize;
		const table = this.props.league.table;
		var i, team;
		var x, y;
		var image;
		var teams = [];

		for (i = 0; i < table.length; i++) {
			team = table[i];
			y = this.getY(team.points) - imageSize / 2;
			x = this.getX(i) * (size - inset * 2) + inset * 2 + 7.5;
			image = <image key={i} xlinkHref={UrlUtil.getEmblemUrl(team.name)} x={x} y={y}
								width={imageSize} height={imageSize} />;
			teams.push(this.getLink(image, team.name));
		}

		return teams;
	}

	getLink(image, team) {
		if (image === null) {
			return null;
		}

		var link = UrlUtil.getLink(this.props.league.season, team);

		if (link) {
			return (
				<Link key={image.key} to={link}>
					{image}
				</Link>
			);
		}

		return image;
	}
}
