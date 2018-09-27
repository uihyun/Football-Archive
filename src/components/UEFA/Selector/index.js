import React, { Component } from 'react';

import './style.css';

import { Team, YearSelector } from '../../Common';

import { colors, clubs, koreans } from '../data';

export default class UEFASelector extends Component {

  render() {
		const year = this.props.match.params.year;
		var countries = [];
		var teamsWithKorean = {};

		clubs.countries.forEach(country => {
			var teams = clubs.seasons[country].teams[year];
			if (teams) {
				countries.push({ code: country, teams: teams });
			}
		});

		if (koreans[year])
			koreans[year].forEach(player => { teamsWithKorean[player.team] = true; });
		const red = colors.mediumred;
		const blue = colors.mediumblue;
		const koreaBG = 'linear-gradient(155deg, ' + red + ', ' + red + ' 50%, ' + blue + ' 50%, ' + blue + ')';

    return (
      <div className="UEFASelector text-center">
				<br />
				<YearSelector year={year} min={clubs.years.min} max={clubs.years.max} link={'UEFA'} />
				<div className="flex-container">
					{countries.map(country => {
						return (
							<div key={country.code} className="flex-1">
								<h3>{country.code}</h3>
								<div className="UEFASelector-flex-container">
									{country.teams.map(team => {
										var style = {};

										if (teamsWithKorean[team]) {
											style.background = koreaBG;
										}

										return (
											<div className="UEFASelector-team" key={team} style={style}>
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
