import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, Year } from '../../Common';

import UrlUtil from '../../../util/url';

export default class LeagueHistory extends Component {
	
	render() {
		const seasonStyle = { lineHeight: '35px' };
		const rankStyle = { fontSize: '1.5em' };
		const headers = ['', '🏆', 2, 3, 4, 5, 6, 7, 8];

		if (window.innerWidth > 543) {
			seasonStyle.lineHeight = '50px';
		}

		return (
			<div className="LeagueHistory">
				<div className="flex-container" style={seasonStyle}>
					{headers.map(rank => {
						return (
							<div key={rank} className="flex-1" style={rankStyle}>
								{rank}
							</div>
						);
					})}
				</div>
				{this.props.seasons.map(season => {
					return (
						<div key={season.season} className="flex-container" style={seasonStyle}>
							<div className="flex-1" style={seasonStyle} >{this.getSeasonSpan(season.season)}</div>
							{season.table.slice(0, 8).map(row => {
								return (
									<div className="flex-1" key={row.name}>
										<Team team={row.name} year={season.season} emblemLarge={true} />
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
	
	getSeasonSpan(year) {
		const fullyear = this.props.name.match(/^K League/);
		const span = <Year year={year} fullyear={fullyear} />;
		const link = UrlUtil.getCompLink(year, this.props.name);

		if (link === null)
			return span;

		return (
			<Link to={link}>
				{span}
			</Link>
		);
	}
}
	
