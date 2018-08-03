import React, { Component } from 'react';

import './style.css';

import { Team, YearSelector } from '../../Common';

import { afc } from '../data';

export default class AFCSelector extends Component {

  render() {
		const year = this.props.match.params.year;
		var afcTeams = [];

		afc.leagues.forEach(league => {
			var teams = afc.seasons[league].teams[year];
			var code = afc.codes[league];
			if (teams) {
				afcTeams.push({ code: code, teams: teams });
			}
		});

    return (
      <div className="AFCSelector text-center">
				<br />
				<YearSelector year={year} min={afc.years.min} max={afc.years.max} link={'AFC'} />
				<div className="flex-container">
					{afcTeams.map(league => {
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
