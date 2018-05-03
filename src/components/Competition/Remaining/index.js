import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team } from '../../Common';

import { colors } from '../data';

import UrlUtil from '../../../util/url';

export default class Remaining extends Component {

	render() {
		const list = this.groupMatches();

		return (
			<div className="flex-container">
				<div className="flex-1 hide-mobile" />
				<div className="flex-2">
					{list.map(team => { return this.getRow(team); })}
				</div>
				<div className="flex-1 hide-mobile" />
			</div>
		);
	}

	getColumn(array, index) {
		const color = [colors.lightred, colors.lightyellow, colors.lightblue];
		const style = { backgroundColor: color[index] };
		const year = this.props.league.season;

		return (
			<div className="flex-1 Remaining-row" style={style} key={index}>
				<div className="flex-container flex-container-center">
					{array.map(vs => {
						return (
							<Link to={UrlUtil.getLink(year, vs.name)}>
								<div key={vs.name} className="Remaining-team">
									<Team team={vs.name} emblemSmall={true} />
								</div>
							</Link>
						);
					})}
				</div>
			</div>
		);
	}
	
	getRow(team) {
		const style = { fontSize: '1.5em', textAlign: 'center' };
		const place = { width: '20px', textAlign: 'center' };
		const year = this.props.league.season;

		return (
			<div className="flex-container" key={team.name}>
				<div className="flex-1 Remaining-points">
					<div className="flex-container">
						<div className="flex-1">
							<Link to={UrlUtil.getLink(year, team.name)}>
								<div className="Remaining-points flex-container flex-container-center flex-container-adaptive">
									<Team team={team.name} emblemLarge={true} />
								</div>
							</Link>
						</div>
						<div className="flex-1" style={style}>{team.points}</div>
					</div>
				</div>
				<div style={place}>
					<div className="Remaining-row">H</div>
					<div className="Remaining-row">A</div>
				</div>
				<div className="flex-3">
					<div className="flex-container">
						{team.home.map((region, index) => { return this.getColumn(region, index); })}
					</div>
					<div className="flex-container">
						{team.away.map((region, index) => { return this.getColumn(region, index); })}
					</div>
				</div>
			</div>
		);
	}

	groupMatches() {
		const table = this.props.league.table;
		const result = this.props.league.result;
		const count = table.length;
		var list = [];
		var i, j, team, row;
		var index;

		for (i = 0; i < count; i++) {
			row = table[i];
			team = {
				name: row.name,
				points: row.points,
				home: [[], [], []],
				away: [[], [], []],
			};

			for (j = 0; j < count; j++) {
				index = Math.floor(j * 3 / count);

				if (i !== j && result[i][j] === null) {
					team.home[index].push(table[j]);
				}

				if (i !== j && result[j][i] === null) {
					team.away[index].push(table[j]);
				}
			}

			list.push(team);
		}

		return list;
	}
}
