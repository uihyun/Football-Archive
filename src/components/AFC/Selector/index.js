import React, { Component } from 'react';

import './style.css';

import { Team, YearSelector } from '../../Common';

import { kleague } from '../data';

export default class AFCSelector extends Component {

  render() {
		const year = this.props.match.params.year;
		var kleagueTeams = [];

		kleague.leagues.forEach(league => {
			var teams = kleague.seasons[league].teams[year];
			var code = league;
			if (teams) {
				kleagueTeams.push({ code: code, teams: teams });
			}
		});

    return (
      <div className="AFCSelector text-center">
				<br />
				<YearSelector year={year} min={kleague.years.min} max={kleague.years.max} link={'AFC'} />
				<div className="flex-container">
					{kleagueTeams.map(league => {
						return (
							<div key={league.code} className="flex-1">
								<h3>{league.code}</h3>
								<div className="AFCSelector-flex-container">
									{league.teams.map(team => {
										return (
											<div className="AFCSelector-team" key={team}>
												<Team team={team} emblemLarge={true} year={year}/>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
      </div>
    );
  }
}
