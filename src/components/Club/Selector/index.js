import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, YearSelector } from '../../Common';

import { clubs, koreans } from '../data';
import UrlUtil from '../../../util/url';

export default class ClubSelector extends Component {

  render() {
		const url = this.props.match.url;
		const year = this.props.match.params.year;
		var countries = [];

		clubs.countries.forEach(country => {
			var teams = clubs.seasons[country].teams[year];
			if (teams) {
				countries.push({ code: country, teams: teams });
			}
		});

    return (
      <div className="ClubSelector text-center">
				<br />
				<YearSelector year={year} min={clubs.years.min} max={clubs.years.max} link={'club'} />
				<div className="flex-container">
					{countries.map(country => {
						return (
							<div key={country.code} className="flex-1">
								<h3>{country.code}</h3>
								<div className="ClubSelector-flex-container">
									{country.teams.map(team => {
										return (
											<div className="ClubSelector-team" key={team}>
												<Team team={team} emblemLarge={true} year={year}/>
											</div>
										);
									})}
								</div>
							</div>
						);
					})}
				</div>
				{koreans[year] && (
					<div>
						<br className="hide-mobile" />
						<div className="flex-container flex-container-space-around flex-container-wrap">
							{koreans[year].map(korean => {
								var i, name;
								var more = [];

								if (korean.more) {
									for (i = 0; i < korean.more.length; i++) {
										name = korean.more[i];
										more.push(<div key={name}>{name}</div>);
									}
								}
								return (
									<div key={korean.name + korean.team} className="text-center">
										<Link to={url + '/' + UrlUtil.getTeamUrl(korean.team)}> 
											<div>
												{korean.name}
											</div>
											<div className="ClubSelector-team">
												<Team team={korean.team} emblemLarge={true}/>
											</div>
											{more}
										</Link>
									</div>
								);
							})}
						</div>
					</div>
				)}
      </div>
    );
  }
}
