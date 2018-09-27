import React, { Component } from 'react';

import './style.css';

import { Team, YearSelector } from '../../Common';

import { afc } from '../data';

export default class AFCSelector extends Component {

  render() {
		const year = this.props.match.params.year;
		var afcTeams = [];

		afc.countries.forEach(leagues => {
			var countryTeams = [];
			leagues.forEach(league => {
				var teams = afc.seasons[league].teams[year];
				var code = afc.codes[league];
				if (teams) {
					countryTeams.push({ code: code, teams: teams });
				}
			});
			afcTeams.push(countryTeams);
		});

    return (
      <div className="AFCSelector text-center">
				<br />
				<YearSelector year={year} min={afc.years.min} max={afc.years.max} link={'AFC'} />
				<div className="flex-container">
					{afcTeams.map((leagues, index) =>
						<div key={index} className="flex-1">
							{leagues.map(league => 
								<div key={league.code}>
									<div className="AFCSelector-league">{league.code}</div>
									<div className="AFCSelector-flex-container">
										{league.teams.map(team => 
											<div className="AFCSelector-team" key={team}>
												<Team team={team} emblemLarge={true} year={year}/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					)}
				</div>
      </div>
    );
  }
}
