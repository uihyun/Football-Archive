import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {Team} from '../Common';

import {seasons, koreans} from '../data';
import UrlUtil from '../../util/url';

export default class ClubSelector extends Component {

  render() {
		const url = this.props.match.url;
		const year = this.props.match.params.year;
		var countries = [];

		seasons.countries.forEach(country => {
			var teams = seasons.seasons[country].teams[year];
			if (teams) {
				countries.push({ code: country, teams: teams });
			}
		});

    return (
      <div className="ClubSelector text-center">
				<br />
				<div className="flex-container flex-container-center">
					<div className="ClubSelector-flex-container-year">
						{this.getYears(year)}
					</div>
				</div>
				<div className="flex-container">
					{countries.map(country => {
						return (
							<div key={country.code} className="flex-1">
								<h3>{country.code}</h3>
								<div className="ClubSelector-flex-container">
									{country.teams.map(team => {
										return (
											<div className="ClubSelector-team" key={team}>
												<Link to={url + '/' + UrlUtil.getTeamUrl(team)}> 
													<Team name={team} emblemLarge={true}/>
												</Link>
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
						<div className="flex-container flex-container-space-around">
							{koreans[year].map(korean => {
								return (
									<div key={korean.name} className="text-center">
										<Link to={url + '/' + UrlUtil.getTeamUrl(korean.team)}> 
											<div>
												{korean.name}
											</div>
											<div className="ClubSelector-team">
												<Team name={korean.team} emblemLarge={true}/>
											</div>
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

	getYears(year) {
		var years = [];
		var i, style = 'ClubSelector-year';

		for (i = seasons.years.min; i <= seasons.years.max; i++) {
			if (i === parseInt(year, 10)) {
				years.push((
					<div key={i} className={style + " ClubSelector-year-selected"}>
						{i}
					</div>
				));
			} else {
				years.push((
					<div key={i} className={style}>
						<Link to={'/club/' + i}>{i}</Link>
					</div>
				));
			}
		}

		return years;
	}
}
