import React, { Component } from 'react';

import './style.css';

import Team from '../../Team';
import Cup from '../../Cup';

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

		if (this.props.data.leagues[0]) {
			league = this.props.data.leagues[0];
			table = table.concat(this.props.data.leagues[0].table);
		}

		return (
			<div>
				<h3 className="text-center">
					{league.name} {league.season - 1}-{league.season}
				</h3>
				<div className="Statistics-flex-container">
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
								<div className="flex-container">
									<div className="flex-1 text-right"><b>{games.p}</b></div>
									<div className="flex-1 text-right">{games.w}</div>
									<div className="flex-1 text-right">{games.d}</div>
									<div className="flex-1 text-right">{games.l}</div>
									<div className="flex-1 text-right"><b>{team.points}</b></div>
									<div className="LeagueTable-buffer"></div>
									<div className="flex-1 text-center">{goals.d}</div>
									<div className="flex-1 text-right">{goals.f}</div>
									<div>{team.name === 'Team' ? '/' : '-'}</div>
									<div className="flex-1">{goals.a}</div>
								</div>
							</div>
						</div>
					);
				})}
					</div>
					<div className="flex-1 hide-mobile" />
				</div>
				{this.props.data.cups.map(cup => {
					return (
						<div key={cup.name}>
							<Cup team={this.props.team} cup={cup} />
						</div>
					);
				})}
			</div>
		);
	}
}
