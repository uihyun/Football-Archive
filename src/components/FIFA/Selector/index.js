import React, { Component } from 'react';

import './style.css';

import {Team} from '../../Common';

import {nations} from '../data';

export default class NationSelector extends Component {

  render() {
		var countries = [];
		const year = nations.years.max;

		nations.confederations.forEach(confederation => {
			var teams = nations.countries[confederation];
			if (teams) {
				countries.push({ code: confederation, teams: teams });
			}
		});

    return (
      <div className="NationSelector text-center">
				<div>
					{countries.map(country => {
						return (
							<div key={country.code}>
								<h3>{country.code}</h3>
								<div className="FIFASelector-flex-container">
									{country.teams.map(team => {
										return (
											<div className="FIFASelector-team" key={team}>
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
