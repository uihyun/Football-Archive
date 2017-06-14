import React, { Component } from 'react';

import './style.css';

import teams from '../../data/teams';
import seasons from '../../data/seasons';
import PlayerStats from '../PlayerStats';

export default class PlayerStatsHeader extends Component {

	constructor(props) {
		super(props);
		var year = 2018;
		var teams = [];
		var season, i;

		for (i in seasons) {
			if (seasons[i]) {
				season = seasons[i];

				if (season.year === year) {
					teams = season.teams;
					break;
				}
			}
		}
		
		this.state = {season: year, team: 'Manchester United', teams: teams};

		this.selectTeam = this.selectTeam.bind(this);
	}

  render() {
    return (
      <div className="PlayerStatsHeader">
				<div className="PlayerStatsHeader-flex-container">
					{seasons.map(season => {
						return (
							<div className="flex-1 text-center" key={season.year}
							     onClick={() => this.selectSeason(season)}>
								<h3>
								{season.year - 2000}
								</h3>
							</div>);
					})}
				</div>
				<div className="PlayerStatsHeader-flex-container">
					{this.state.teams.map(team => {
						return this.getLogo(team);
					})}
				</div>
        <h2 className="PlayerStatsHeader-header">
          {this.state.season - 1} {this.getLogo(this.state.team)} {this.state.season}
        </h2>
				<PlayerStats season={this.state.season} team={this.state.team} />
      </div>
    );
  }

	selectSeason(season) {
		var team = 'Manchester United';

		for (var i in season.teams) {
			if (this.state.team === season.teams[i]) {
				team = this.state.team;
				break;
			}
		}

		this.setState({
			season: season.year,
			team: team,
			teams: season.teams
		});
	}

	selectTeam(team) {
		this.setState({team: team});
	}

	getLogo(team) {
		var logoID = 2608043;
		if (teams[team] !== undefined) {
			logoID = teams[team].id;
		}

		var imgSrc = 'http://img.uefa.com/imgml/TP/teams/logos/50x50/' + logoID + '.png';

		return (
			<div className="PlayerStatsHeader-team" key={team} onClick={() => this.selectTeam(team)}>
				<img src={imgSrc} className="PlayerStatsHeader-logo" alt="" />
			</div>
		);
	}
}
