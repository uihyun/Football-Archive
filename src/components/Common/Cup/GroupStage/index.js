import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { colors } from '../../data';

import UrlUtil from '../../../../util/url';

export default class GroupStage extends Component {

	render() {
		let cup = this.props.cup;
		let groups = this.getGroups(cup);

		if (groups.length === 0)
			return null;

		let groupCount = this.getGroupCount(groups);

		let width = this.props.size;
		let height = width / 3;

		var headers = [];
		var teams = [];

		var i, group;
		var j, team;
		var header;
		var image;
		var x, y, dx, dy, myX;
		var url;
		var isTeamInGroup;
		var style;
		var bg = null;

		const teamSize = 20;
		const hTeamSize = teamSize / 2;

		dx = width / groups.length;
		dy = height / (groupCount + 1);
		for (i = 0; i < groups.length; i++) {
			group = groups[i];

			x = dx * (i + 0.5);
			y = dy * 0.5;

			isTeamInGroup = this.isTeamInGroup(group);
			style = this.getHeaderStyle(isTeamInGroup, groupCount);

			if (isTeamInGroup) {
				bg = <rect x={dx * i} y={0} width={dx} height={height} fill={this.getBackgroundColor()} />;
			}

			header = (
				<text key={i + Math.random()} x={x} y={y} style={style}>
					{group.name}
				</text>
			);

			x -= hTeamSize;
			y -= hTeamSize;
			for (j = 0; j < group.table.length; j++) {
				team = group.table[j].name;
				url = UrlUtil.getEmblemUrl(team);

				myX = x;
				y += dy;

				if (group.table.length > 5) {
					if (j % 2 === 0) {
						myX -= 10;
					} else {
						myX += 10;
					}
				}

				image = <image key={team} xlinkHref={url} x={myX} y={y} width={teamSize} height={teamSize} />;
				teams.push(this.getLink(image, team));
			}

			headers.push(header);
		}
		
		return (
			<svg className="GroupStage" width={width} height={height}>
				{bg}
				{headers}
				{teams}
			</svg>
		);
	}

	isTeamInGroup(group) {
		var i, team;

		for (i = 0; i < group.table.length; i++) {
			team = group.table[i].name;

			if (team === this.props.team)
				return true;
		}

		return false;
	}

	getHeaderStyle(highlight, groupCount) {
		var style = {
			fill: 'gray',
			alignmentBaseline: 'middle',
			textAnchor: 'middle',
			fontSize: '1.' + ((6 - groupCount) * 2.5) + 'em'
		};

		if (window.innerWidth <= 350) {
			style.fontSize = '1em';
		}

		if (highlight) {
			style.fill = 'black';
		}

		return style;
	}

	getGroups(cup) {
		var groups = [];
		var i, round;

		for (i = 0; i < cup.rounds.length; i++) {
			round = cup.rounds[i];

			if (round.name.includes('Group') && round.table) {
				groups.push({ name: round.name.replace(/Group /, ''), table: round.table });
			}
		}

		return groups;
	}

	getGroupCount(groups) {
		var i, max = 0;

		for (i = 0; i < groups.length; i++) {
			max = Math.max(groups[i].table.length, max);
		}

		return max;
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

	getBackgroundColor() {
		const cup = this.props.cup;
		var i, round;
		var j, match;

		if (cup.rounds[cup.rounds.length - 1].name.includes('Group')) {
			return colors.lightyellow;
		}

		for (i = cup.rounds.length - 1; i >= 0; i--) {
			round = cup.rounds[i];
			for (j = 0; j < round.matches.length; j++) {
				match = round.matches[j];

				if (match.l === this.props.team || match.r === this.props.team) {
					if (round.name.includes('Group')) {
						return colors.lightred;
					} else {
						return colors.lightgray;
					}
				}
			}
		}
	}
}
