import React, { Component } from 'react';

import './style.css';

import {Team} from '..';

export default class LeagueTable extends Component {

	render() {
		var league = '';
		const header = {
			name: 'Team',
			games: {p: 'Pl', w: 'W', d: 'D', l: 'L'},
			goals: {d: 'Gd', f: '+', a: '-'},
			points: 'Pt'
		};
											
		var table = [header];

		league = this.props.league;
		table = table.concat(league.table);

		return (
			<div>
				<h3 className="text-center">{league.name}</h3>
				<div className="flex-container">
					<div className="flex-1 hide-mobile" />
					<div className="flex-2">
				{table.map(team => {
					const games = team.games;
					const goals = team.goals;
					return (
						<div key={team.name} className="flex-container LeagueTable-row">
							<div className="flex-1">
								<div className="flex-container">
									<div className="LeagueTable-rank text-center">{team.rank} </div>
									{team.name === this.props.team ?
										<b><Team name={team.name} /></b> : <Team name={team.name} />
									}
								</div>
							</div>
							<div className="flex-1">
								<div className="flex-container LeagueTable-small text-right">
									<div className="flex-1"><b>{games.p}</b></div>
									<div className="flex-1">{games.w}</div>
									<div className="flex-1">{games.d}</div>
									<div className="flex-1">{games.l}</div>
									<div className="flex-1"><b>{team.points}</b></div>
									<div className="LeagueTable-buffer"></div>
									<div className="flex-1 text-center">{goals.d}</div>
									<div className="flex-1">{goals.f}</div>
									<div>{team.name === 'Team' ? '/' : '-'}</div>
									<div className="flex-1 text-left">{goals.a}</div>
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
}
