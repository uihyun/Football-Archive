import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import Match from '../../../util/match';
import UrlUtil from '../../../util/url';

export default class Year extends Component {

	constructor(props) {
		super(props);

		this.state = this.newState(this.props);
		
		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

	newState(props) {
		const matches = Match.extractAndSort(props.data);
		var summaries = [];

		for (var i = 0; i < matches.length; i++) {
			summaries[i] = Match.summarizeResult(matches[i], props.team);
		}

		const firstDay = this.getFirstDay(matches);
		const lastDay = this.getLastDay(matches);
		const monthEndmarks = this.getMonthEndmarks(firstDay, lastDay);

		return {
			matches: matches,
			summaries: summaries,
			firstDay: firstDay,
			lastDay: lastDay,
			monthEndmarks: monthEndmarks,
			selectedPlayer: null};
	}
	
	render() {
		const width = 350;
		const height = 350;
		const cx = width / 2;
		const cy = height / 2;
		const circleR = 110;

		const circle = <circle cx={cx} cy={cy} r={circleR} stroke="black" strokeWidth="1" fill="none" />;

		var i, match;
		var matches = [];
		var ticks = [];
		var teams = [];
		var months = [];
	
		const matchR = 135;
		const Astr = ' A ' + matchR + ' ' + matchR + ' ';
		const teamR = 160;
		const teamSize = 18;
		var rot, dRot;
		var dTheta, thetaOffset, theta, theta1, theta2;
		var d;
		var x, y, x1, y1, x2, y2;
		var stroke, path;
		var image, vs, url;
		const tickWidth = 5;
		var prevTheta;
		var month;

		const colors = {
			win: 'hsl(210, 100%, 50%)',
			draw: 'hsl( 40, 100%, 50%)',
			loss: 'hsl(360,  90%, 50%)', 
			unplayed: 'lightgray'
		};

		dRot = 360 / (this.state.matches.length + 2);
		dTheta = 2 * Math.PI / (this.state.matches.length + 2);
		thetaOffset = Math.PI * -0.5 + dTheta;

		function getTick(theta, i) {
			const tickR = 120;
			var x1 = cx + (tickR - tickWidth) * Math.cos(theta);
			var y1 = cx + (tickR - tickWidth) * Math.sin(theta);
			var x2 = cx +	(tickR + tickWidth) * Math.cos(theta);
			var y2 = cx + (tickR + tickWidth) * Math.sin(theta);
			return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="gray" strokeWidth="1" />;
		}

		function getMonth(month, theta) {
			const monthR = 100;
			var x = cx + monthR * Math.cos(theta);
			var y = cx + monthR * Math.sin(theta);
			return (
				<text key={theta} x={x} y={y} alignmentBaseline="middle" textAnchor="middle" fontSize="1.5em"
				 fill="gray">
					{month}
				</text>
			);
		}

		for (i = 0; i < this.state.matches.length; i++) {
			match = this.state.matches[i];
			rot = dRot * i;
			theta1 = dTheta * i + thetaOffset;
			theta2 = dTheta * (i + 1) + thetaOffset;
			x1 = cx + matchR * Math.cos(theta1);
			y1 = cx + matchR * Math.sin(theta1);
			x2 = cx +	matchR * Math.cos(theta2);
			y2 = cx + matchR * Math.sin(theta2);
			d = 'M ' + x1 + ' ' + y1 + Astr + rot + ' 0 1 ' + x2 + ' ' + y2;
			stroke = colors[this.state.summaries[i].result];
			path = <path key={i} d={d} stroke={stroke} fill="none" strokeWidth="20" />;
			if (match.url) {
				path = <Link key={i} to={'/match/' + match.url}>{path}</Link>;
			}
			matches.push(path);

			theta = dTheta * (i + 0.5) + thetaOffset;
			x = cx + teamR * Math.cos(theta) - teamSize / 2;
			y = cx + teamR * Math.sin(theta) - teamSize / 2;
			vs = match.vs;
			url = UrlUtil.getEmblemUrl(vs);
			image = <image key={i} xlinkHref={url} x={x} y={y} width={teamSize} height={teamSize} />;
			teams.push(this.getLink(image, vs));

			if (i === 0 ||
					(this.state.matches[i - 1].date.substring(0, 2) !== match.date.substring(0, 2))) {
				ticks.push(getTick(theta1, i));

				if (prevTheta !== undefined) {
					theta = (prevTheta + theta1) / 2;
					month = parseInt(this.state.matches[i - 1].date.substring(0, 2), 10);
					months.push(getMonth(month, theta));
				}

				prevTheta = theta1;
			}

			if (i === this.state.matches.length - 1) {
				ticks.push(getTick(theta2, i + 1));
				
				if (prevTheta !== undefined) {
					theta = (prevTheta + theta2) / 2;
					month = parseInt(match.date.substring(0, 2), 10);
					months.push(getMonth(month, theta));
				}
			}
		}

		return (
			<div className="Year flex-container flex-container-center">
				<svg width={width} height={width}>
					{ticks}
					{matches}
					{teams}
					{months}
				</svg>
			</div>
		);
	}

	selectPlayer(player) {
		this.setState({ selectedPlayer: player });
	}

	getLink(image, team) {
		if (image === null) {
			return null;
		}

		var link = UrlUtil.getLink(this.props.data.season, team);

		if (link) {
			return (
				<Link key={image.key} to={link}>
					{image}
				</Link>
			);
		}

		return image;
	}

	getFirstDay(matches) {
		if (matches.length === 0)
			return new Date();

		const match = matches[0];
		var array = match.date.split('/');
		return new Date(array[2], array[0] - 1, 1);
	}

	getLastDay(matches) {
		if (matches.length === 0)
			return new Date();

		const match = matches[matches.length - 1];
		var array = match.date.split('/');
		return new Date(array[2], array[0] - 0, 0);
	}

	getMonthEndmarks(firstDay, lastDay) {
		var cur;
		var array = [];
			
		cur = firstDay;
		cur = new Date(cur.getFullYear(), cur.getMonth(), 0);

		while (true) {
			cur = new Date(cur.getFullYear(), cur.getMonth() + 2, 0);
			array.push(cur);

			if (cur.getFullYear() === lastDay.getFullYear() &&
					cur.getMonth() === lastDay.getMonth()) {
				break;
			}
		}

		return array;
	}

	getDayPercentage(date) {
		return (date - this.state.firstDay) / (this.state.lastDay - this.state.firstDay);
	}
}
