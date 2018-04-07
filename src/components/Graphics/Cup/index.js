import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {rounds} from '../data';

import UrlUtil from '../../../util/url';

export default class Cup extends Component {

	render() {
		let cup = this.props.cup;
		let sorted = this.getSorted();
		let grid = this.getGrid(sorted);

		let width = 350;
		let height = 350;
		
		var circles = [];
		let cx = width / 2;
		let cy = height / 2;

		var teams = [];
		var i, j, round, level, team;
		var x, y, r, theta, log2, dTheta;
		var size, hsize, lsize, hlsize;

		let filterId = 'greyscale' + Math.random();
		let filterUrl = 'url(#' + filterId + ')';

		var lastRound = [];
		let lastRoundIndex = this.getLastRound(sorted);
		var image;

		for (i = 0; i < grid.length; i++) {
			round = grid[i];
			level = round.level;
			log2 = this.getlog2(level);
			dTheta = 2 * Math.PI / level;
				
			r = 25 * log2 + 6;

			size = 28 - log2 * 2;
			hsize = size / 2;

			lsize = size - 4;
			hlsize = lsize / 2;
			
			if (i === lastRoundIndex) {
				if (i === 0) {
					lastRound.push(<circle key={0} cx={cx} cy={cy} r={r + 13} fill="#f0f0f0" />);
				} else {
					lastRound.push(<circle key={0} cx={cx} cy={cy} r={r} stroke="#f0f0f0" strokeWidth="25" fill="none" />);
				}
			}
			
			circles.push(<circle key={r} cx={cx} cy={cy} r={r + 13} stroke="lightgrey" strokeWidth="1" fill="none" />);

			if (i === 0) {
				if (log2 > 1 || cup.winner === undefined) {
					r -= 10;
					size += 10;
					hsize = size / 2;
				}
			}
			
			for (j = 0; j < round.teams.length; j++) {
				team = round.teams[j];

				if ((team === undefined) ||
						(i > 0 && j % 2 === 0) ||
						(cup.winner && i + j === 0))
					continue;

				theta = dTheta * (j - 1);
				if (i === 0 && log2 !== 1) {
					theta += dTheta;
				}
				x = cx + r * Math.cos(theta) - hsize;
				y = cy + r * Math.sin(theta) - hsize;

				image = <image key={level + team} xlinkHref={UrlUtil.getEmblemUrl(team)} x={x} y={y} width={size} height={size} />;
				teams.push(this.getLink(image, team));

				if (((i === 0 && cup.winner) || (i > 0 && i < grid.length - 1)) &&
						grid[i + 1].teams[2 * j] === team) {
					theta += dTheta;
					x = cx + r * Math.cos(theta) - hlsize;
					y = cy + r * Math.sin(theta) - hlsize;
					image = <image key={level + team + '2'} xlinkHref={UrlUtil.getEmblemUrl(team)} x={x} y={y} width={lsize} height={lsize} filter={filterUrl} />;
					teams.push(this.getLink(image, team));
				}
			}
		}

		let wsize = 40;
		let hwsize = wsize / 2;
		var cupWinner = null;

		if (cup.winner) {
			image = <image xlinkHref={UrlUtil.getEmblemUrl(cup.winner)} x={cx - hwsize}  y={cy - hwsize} width={wsize} height={wsize} />;
			cupWinner = this.getLink(image, cup.winner);
		}

		return (
			<div className="Cup">
				<h3 className="text-center">{cup.name}</h3>
				<div className="Cup-flex-container">
					<svg width={width} height={height}>
						{lastRound}
						{teams}
						{circles}
						{cupWinner}
						<filter id={filterId}>
							<feColorMatrix type="matrix"
							 values="0.3333	0.3333 0.3333 0.3 0 
											 0.3333 0.3333 0.3333 0.3 0
											 0.3333 0.3333 0.3333 0.3 0
											 0			0			 0 			1 	0"/>
						</filter>
					</svg>
				</div>
			</div>
		)
	}

	getlog2(level) {
		for (var i = 1; i < 10; i++) {
			if (Math.pow(2, i) === parseInt(level, 10)) {
				return i;
			}
		}
	}

	getSorted() {
		let cup = this.props.cup;
		let roundNumber = rounds.getRoundNumbers(cup.name);

		var array = [];
		cup.rounds.forEach(function (round) {
			if (!round.name.match(/^Group/)) {
				array.push(round);
			}
		});
		array.sort(function(a, b) {
			if (a.name === 'Final') {
				return -1;
			} else if (b.name === 'Final') {
				return 1;
			} else {
				return parseInt(roundNumber[a.name], 10) - parseInt(roundNumber[b.name], 10);
			}
		});

		return array;
	}

	arrayToMap(array) {
		var map = {};
		
		array.forEach(function (elem, index) {
			map[elem] = index;
		});

		return map;
	}

	getGrid(sorted) {
		let cup = this.props.cup;
		let roundNumber = rounds.getRoundNumbers(cup.name);
		var grid = [];
		var round, prevLevel, prevMap;
		var i, j;
		var match, index;

		for (i = 0; i < sorted.length; i++) {
			round = sorted[i];

			let level = roundNumber[round.name];
			let array = [];

			if (round.name === 'Final') {
				array[0] = round.matches[0][0];
				array[1] = round.matches[0][1];
				if (cup.winner === array[1]) {
					array.reverse();
				}
				level = 2;
			} else if (i === 0) {
				for (j = 0; j < round.matches.length; j++) {
					match = round.matches[j];
					array.push(match[0], match[1]);
				}
			} else {
				for (j = 0; j < round.matches.length; j++) {
					match = round.matches[j];

					if (prevMap[match[0]] !== undefined) {
						index = prevMap[match[0]];
						array[index * 2] = match[0];
						array[index * 2 + 1] = match[1];
					} else if (prevMap[match[1]] !== undefined) {
						index = prevMap[match[1]];
						array[index * 2] = match[1];
						array[index * 2 + 1] = match[0];
					}
				}
			}

			prevLevel = { level: level, teams: array };
			grid.push(prevLevel);
			
			prevMap = this.arrayToMap(array);
		}

		return grid;
	}

	getLastRound(sorted) {

		var i, j;
		var round, match;

		for (i = 0; i < sorted.length; i++) {
			round = sorted[i];
			for (j = 0; j < round.matches.length; j++) {
				match = round.matches[j];
				if (match[0] === this.props.team || match[1] === this.props.team) {
					return i;
				}
			}
		}

		return null;
	}

	getLink(image, team) {
		if (image === null) {
			return null;
		}

		var link = UrlUtil.getLink(this.props.cup.season, team);

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
