import React, { Component } from 'react';

import './style.css';

import EmblemLarge from '../EmblemLarge';

import seasons from '../../data/seasons';

export default class TeamSelector extends Component {

	constructor(props) {
		super(props);
		var teams = [];
		var season, i;

		for (i in seasons) {
			if (seasons[i]) {
				season = seasons[i];

				if (season.year === this.props.season.year) {
					teams = season.teams;
					break;
				}
			}
		}
		
		this.state = {teams: teams};

		this.selectTeam = this.selectTeam.bind(this);
	}

  render() {
    return (
      <div className="TeamSelector">
				<div className="TeamSelector-flex-container">
					{seasons.map(season => {
						var style = '';
						
						if (season.year !== this.props.season.year) {
							style = 'TeamSelector-year';
						}

						return (
							<div className={"flex-1 text-center " + style}
						 			 key={season.year}
							     onClick={() => this.selectSeason(season)}>
								<h3>
								{season.year - 2000}
								</h3>
							</div>);
					})}
				</div>
				<div className="TeamSelector-flex-container">
					{this.state.teams.map(team => {
						return this.getLogo(team);
					})}
				</div>
      </div>
    );
  }

	selectSeason(season) {
		var team = 'Manchester United';

		for (var i in season.teams) {
			if (this.props.season.team === season.teams[i]) {
				team = this.props.season.team;
				break;
			}
		}

		this.setState({teams: season.teams});

		this.props.onSelect({year: season.year, team: team});
	}

	selectTeam(team) {
		this.props.onSelect({year: this.props.season.year, team: team});
	}

	getLogo(team) {
		var style = '';

		if (team === this.props.season.team) {
			style = 'TeamSelector-team-selected';
		}

		return (
			<div className={"TeamSelector-team " + style} key={team} onClick={() => this.selectTeam(team)}>
				<EmblemLarge team={team} />
			</div>
		);
	}
}
