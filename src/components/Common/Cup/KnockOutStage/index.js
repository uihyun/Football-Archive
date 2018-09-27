import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { colors } from '../../data';

import UrlUtil from '../../../../util/url';

export default class KnockOutStage extends Component {

	render() {
		let cup = this.props.cup;
		let rounds = this.getRounds(cup);

		if (rounds.length === 0)
			return null;

		this.makeGrid(cup, rounds);

		let lastRoundIndex = this.getLastRound(rounds);

		let filterId = 'greyscale' + Math.random();
		let filterUrl = 'url(#' + filterId + ')';

		var lastRound = null;
		var teams = [];
		var circles = [];
		var cupWinner = null;
		var image;
		
		let width = this.props.size;
		let height = width;
		
		this.calculate(rounds, width);
		
		let cx = width / 2;
		let cy = height / 2;
		
		let wsize = 40;
		let hwsize = wsize / 2;

		var i, j, round, level, team;
		var x, y, r, theta, log2, dTheta;
		var size, hsize, lsize, hlsize;

		var thetaOffset = 0;
		var color

		if (rounds[0].level > 2) {
			thetaOffset = Math.PI / rounds[0].level;
		}

		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
			level = round.level;
			log2 = round.log2;
			dTheta = 2 * Math.PI / level;

			r = round.r;
			size = round.size;
			hsize = size / 2;
			
			if (i === lastRoundIndex) {
				if (i === 0) {
					color = colors.mediumyellow;

					if (cup.winner)
						color = (cup.winner === this.props.team) ? colors.mediumblue : colors.mediumred;

					lastRound = <circle key={0} cx={cx} cy={cy} r={r + hsize + 1} fill={color} />;
				} else {
					lastRound = <circle key={0} cx={cx} cy={cy} r={r - 0.5} stroke={colors.lightred} strokeWidth={size + 3} fill="none" />;
				}
			}
			
			circles.push(<circle key={r} cx={cx} cy={cy} r={r + hsize + 1} stroke="lightgrey" strokeWidth="0.5" fill="none" />);
		
			if (i === 0) {
				if (log2 > 1 || cup.winner === undefined) {
					r -= 10;
					size += 10;
					hsize = size / 2;
				}
			}
			
			size = Math.min(size, wsize)
			hsize = size / 2;
			lsize = size - 4;
			hlsize = lsize / 2;
			
			for (j = 0; j < round.grid.length; j++) {
				team = round.grid[j];

				if ((team === undefined) ||
						(i > 0 && j % 2 === 0 && j < rounds[i - 1].grid.length * 2) ||
						(cup.winner && i + j === 0))
					continue;
				
				theta = dTheta * (j - 1) + thetaOffset;
				if ((i === 0 && (log2 > 1 || cup.winner === undefined)) || 
						(i > 0 && j >= rounds[i - 1].grid.length * 2)) {
					theta += dTheta;
				}
				
				x = cx + r * Math.cos(theta) - hsize;
				y = cy + r * Math.sin(theta) - hsize;

				image = <image key={log2 + team} xlinkHref={UrlUtil.getEmblemUrl(team)} x={x} y={y} width={size} height={size} />;
				teams.push(this.getLink(image, team));
				
				if (((i === 0 && cup.winner) || (i > 0 && i < rounds.length - 1 && j < rounds[i - 1].grid.length * 2)) &&
						rounds[i + 1].grid[2 * j] === team) {
					theta += dTheta;
					x = cx + r * Math.cos(theta) - hlsize;
					y = cy + r * Math.sin(theta) - hlsize;
					image = <image key={log2 + team + '2'} xlinkHref={UrlUtil.getEmblemUrl(team)} x={x} y={y} width={lsize} height={lsize} filter={filterUrl} />;
					teams.push(this.getLink(image, team));
				}
			}
		}

		if (cup.winner) {
			image = <image xlinkHref={UrlUtil.getEmblemUrl(cup.winner)} x={cx - hwsize}  y={cy - hwsize} width={wsize} height={wsize} />;
			cupWinner = this.getLink(image, cup.winner);
		}

		return (
			<svg className="KnockOutStage" width={width} height={height}>
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
		);
	}
	
	getLastRound(rounds) {
		var i, round;

		if (this.props.team === undefined && this.props.cup.winner === undefined) {
			return 0;
		}

		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.map[this.props.team] !== undefined) {
				return i;
			}
		}

		return null;
	}

	calculate(rounds, width) {
		var base = 1;
		var log2 = 0;
		var i, round;

		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
			while (base << i < round.grid.length) {
				base <<= 1;
				log2++;
			}
		}
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
			round.level = base << i;
			round.log2 = log2 + i;
		}

		var count = round.log2 * 2 + 1;
		var winnerSize = 40;
		var bufferSize = round.log2 * 2 * 3;
		var baseSize = (width - bufferSize - winnerSize - 5) / count;
		var r = 20 + 3 + (log2 - 1) * (baseSize + 3);
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
			round.size = baseSize + (rounds.length / 2 - i) * 2;
			round.r = r + round.size / 2;

			r += round.size + 3;
		}
	}

	arrayToMap(array) {
		var map = {};
		var i, entry;

		for (i = 0; i < array.length; i++) {
			entry = array[i];

			if (entry) {
				map[entry] = i;
			}
		}

		return map;
	}

	makeGrid(cup, rounds) {
		var i, round;
		var j, teamL, teamR, index;
		var k, offset;
		var map, grid;

		round = rounds[0];
		round.grid = round.teams;

		if (cup.winner && round.grid[1] === cup.winner) {
			round.grid.reverse();
		}

		rounds[0].map = this.arrayToMap(rounds[0].grid);
		for (i = 1; i < rounds.length; i++) {
			round = rounds[i];
			rounds[i - 1].map = this.arrayToMap(rounds[i - 1].grid);
			grid = [];

			for (j = 0; j < round.teams.length; j += 2) {
				teamL = round.teams[j];
				teamR = round.teams[j + 1];

				k = i - 1;
				while (k >= 0) {
					map = rounds[k].map;
					offset = 1 << (i - k);
				
					if (map[teamL] !== undefined) {
						grid[map[teamL] * offset] = teamL;
						grid[map[teamL] * offset + 1] = teamR;
						break;
					} else if (map[teamR] !== undefined) {
						grid[map[teamR] * offset] = teamR;
						grid[map[teamR] * offset + 1] = teamL;
						break;
					}

					k--;
				}

				if (k === -1) {
					console.log(teamL + ' ' + teamR);
					index = Math.max(rounds[i - 1].grid.length * 2, grid.length);
					grid[index] = teamL;
					grid[index + 1] = teamR;
				}
			}

			round.grid = grid;
			round.map = this.arrayToMap(grid);
		}
	}

	addIfNew(team, map, array) {
		if (map[team] === undefined) {
			map[team] = array.length;
			array.push(team);
		}
	}

	getRounds(cup) {
		var rounds = [];
		var i, round;
		var j, match;
		var map, teams;

		for (i = 0; i < cup.rounds.length; i++) {
			round = cup.rounds[i];
			teams = [];
			map = {};

			if (round.name.includes('Group')) {
				rounds = []; // removes rounds before group stage
				continue;
			}
			
			if (round.name.includes('place')) {
				continue;
			}

			for (j = 0; j < round.matches.length; j++) {
				match = round.matches[j];
				this.addIfNew(match.l, map, teams);
				this.addIfNew(match.r, map, teams);
			}

			rounds.push({ teams: teams });
		}

		rounds.reverse();

		return rounds;
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
