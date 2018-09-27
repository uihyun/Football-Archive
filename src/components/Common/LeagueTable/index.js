import React, { Component } from 'react';

import './style.css';

import { Team } from '..';

import { colors } from '../data';

export default class LeagueTable extends Component {

	render() {
		const header = {
			name: 'Team',
			games: {p: 'Pl', w: 'W', d: 'D', l: 'L'},
			goals: {d: 'Gd', f: '+', a: '-'},
			points: 'Pt'
		};
											
		var table = [header];

		var league = this.props.league;
		var teamName = this.props.team;
		
		if (this.props.data) {
			league = this.props.data.league;
			teamName = this.props.data.team;
		}

		table = table.concat(league.table);

		return (
			<div>
				{this.props.hideName ||
					(this.props.data && this.props.data.hideName) ||
					<h3 className="text-center">{league.name}</h3>
				}
				<div className="flex-container">
					<div className="flex-1 hide-mobile" />
					<div className="flex-2">
				{table.map(team => {
					const games = team.games;
					const goals = team.goals;
					const teamComp = <Team team={team.name} year={league.season} />
					return (
						<div key={team.name} className="flex-container LeagueTable-row">
							<div className="flex-1">
								<div className="flex-container">
									<div className="LeagueTable-rank text-center">{team.rank} </div>
									{team.name === teamName ? <b>{teamComp}</b> : teamComp}
								</div>
							</div>
							<div className="flex-1">
								<div className="flex-container LeagueTable-small text-right">
									<div className="flex-1"><b>{this.formatNumber(games.p)}</b></div>
									<div className="flex-1">{this.formatNumber(games.w)}</div>
									<div className="flex-1">{this.formatNumber(games.d)}</div>
									<div className="flex-1">{this.formatNumber(games.l)}</div>
									<div className="flex-1"><b>{this.formatNumber(team.points)}</b></div>
									<div className="LeagueTable-buffer"></div>
									<div className="flex-1 text-center">{this.formatNumber(goals.d)}</div>
									<div className="flex-1">{this.formatNumber(goals.f)}</div>
									<div>{team.name === 'Team' ? '/' : '-'}</div>
									<div className="flex-1 text-left">{this.formatNumber(goals.a)}</div>
								</div>
							</div>
						</div>
					);
				})}
					</div>
					<div className="flex-1 hide-mobile" />
				</div>
			</div>
		);
	}

	formatNumber(number) {
		var style = {};
		var className = '';

		if (number < 0)
			style.color = colors.red;

		if (number >= 100)
			className += 'LeagueTable-thin';

		return <span className={className} style={style}>{number}</span>;
	}
}
