import React, { Component } from 'react';

import './style.css';

import { Team, Scoreboard } from '..';

export default class Grid extends Component {

	render() {
		var rows = this.getRows();

		return (
			<div className="Grid">
				{rows.map((row, index) => {
					return (
						<div key={index} className="Grid-flex-container">
							{row}
						</div>
					);
				})}
			</div>
		);
	}
	
	getEntryView(entry) {
		const year = this.props.year;
		const teams = entry.teams;
		var match;
		var emptyTeamStyle = { width: '26px' };
		var smallTeamStyle = { marginLeft: '3px', marginRight: '3px', height: '21px' };

		if (window.innerWidth <= 350) {
			emptyTeamStyle.width = '22px';
			smallTeamStyle.marginLeft = '1px';
			smallTeamStyle.marginRight = '1px';
		}

		const largeView = (
			<div className="hide-mobile flex-container flex-container-center" key={0}>
				<Team team={teams[0]} emblemLarge={true} year={year}/>
				<div className="Grid-long-scoreboard">
					{entry.matches.map((match, index) => {
						return <Scoreboard key={index} team={teams[0]} match={match} />;
					})}
				</div>
				<Team team={teams[1]} emblemLarge={true} year={year}/>
			</div>
		);

		if (entry.matches.length === 1) {
			match = entry.matches[0];

			return [
				largeView,
				<div className="show-mobile-flex flex-container flex-container-center" key={1}>
					<div style={smallTeamStyle}>
						<Team team={teams[0]} emblemSmall={true} year={year}/>
					</div>
					<Scoreboard team={teams[0]} match={match} shrinkOnMobile={true} />
					<div style={smallTeamStyle}>
						<Team team={teams[1]} emblemSmall={true} year={year}/>
					</div>
				</div>
			];
		} else {
			return [
				largeView,
				<div className="show-mobile-flex flex-container flex-container-center" key={1}>
					<div style={smallTeamStyle}>
						<Team team={teams[0]} emblemSmall={true} year={year}/>
					</div>
					<Scoreboard team={teams[0]} match={entry.matches[0]} shrinkOnMobile={true} />
					<div style={emptyTeamStyle}></div>
				</div>,
				<div className="show-mobile-flex flex-container flex-container-center" key={2}>
					<div style={emptyTeamStyle}></div>
					<Scoreboard team={teams[0]} match={entry.matches[1]} shrinkOnMobile={true} />
					<div style={smallTeamStyle}>
						<Team team={teams[1]} emblemSmall={true} year={year}/>
					</div>
				</div>,
			];
		}
	}

	getRows() {
		const matches = this.props.matches;
		var rows = [];
		var i, j, entry;

		for (i = 0; i < matches.length / 4; i++) {
			rows[i] = [];

			for (j = 0; j < 4; j++) {
				if (i * 4 + j < matches.length) {
					entry = matches[i * 4 + j];
					if (entry === null || entry === undefined) {
						rows[i][j] = (<div key={i * 4 + j} className="flex-1" />);
					} else {
						rows[i][j] = (
							<div key={i * 4 + j} className="flex-1">
								{this.getEntryView(entry)}
							</div>
						);
					}	
				} else if (this.props.noFiller !== true) {
					rows[i][j] = (<div key={i * 4 + j} className="flex-1" />);
				}
			}
		}

		return rows;
	}
}
