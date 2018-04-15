import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import UrlUtil from '../../../../util/url';

export default class GroupStage extends Component {

	render() {
		let cup = this.props.cup;
		let groups = this.getGroups(cup);
		
		let width = this.props.size;
		let height = width / 3;

		if (groups.length === 0)
			return null;

		var headers = [];
		var teams = [];

		var i, group;
		var j, team;
		var header;
		var image;
		var x, y, dx, dy;
		var url;
		var isTeamInGroup;
		var style;
		var bg = null;

		const teamSize = 20;
		const hTeamSize = teamSize / 2;

		dx = width / groups.length;
		dy = height / 5;
		for (i = 0; i < groups.length; i++) {
			group = groups[i];

			x = dx * (i + 0.5);
			y = dy * 0.5;

			isTeamInGroup = this.isTeamInGroup(group);
			style = this.getHeaderStyle(isTeamInGroup);

			if (isTeamInGroup) {
				bg = <rect x={dx * i} y={0} width={dx} height={height} fill="#f0f0f0" />;
			}

			header = (
				<text key={i} x={x} y={y} style={style}>
					{group.name}
				</text>
			);

			x -= hTeamSize;
			y -= hTeamSize;
			for (j = 0; j < group.table.length; j++) {
				team = group.table[j].name;
				url = UrlUtil.getEmblemUrl(team);

				y += dy;

				image = <image key={team} xlinkHref={url} x={x} y={y} width={teamSize} height={teamSize} />;
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

	getHeaderStyle(highlight) {
		var style = {
			fill: 'gray',
			alignmentBaseline: 'middle',
			textAnchor: 'middle',
			fontSize: '1.5em'
		};

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
