import React, { Component } from 'react';

import './style.css';

import TimelineBody from '../TimelineBody';
import teams from '../../data/teams';
import seasons from '../../data/seasons';

export default class Timeline extends Component {

	constructor(props) {
		super(props);
		var year = 2017;
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
		
		this.state = {season: year, seasonString: '16-17', team: 'Manchester United', teams: teams};

		this.selectTeam = this.selectTeam.bind(this);
	}

  render() {
    return (
      <div className="Timeline">
				<div className="Timeline-flex-container">
					{this.state.teams.map(team => {
						return this.getLogo(team);
					})}
				</div>
        <h2 className="Timeline-header">
          {this.state.season - 1} {this.getLogo(this.state.team)} {this.state.season}
        </h2>
				<TimelineBody season={this.state.season} team={this.state.team} />
      </div>
    );
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
			<div className="Timeline-team" key={team} onClick={() => this.selectTeam(team)}>
				<img src={imgSrc} className="Timeline-logo" alt="" />
			</div>
		);
	}
}
