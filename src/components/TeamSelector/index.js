import React, { Component } from 'react';

import './style.css';

import {EmblemLarge} from '../Common';

import {seasons, koreans} from '../data';

export default class TeamSelector extends Component {

	constructor(props) {
		super(props);

		this.state = this.newState(this.props);

		this.selectCountry = this.selectCountry.bind(this);
		this.selectYear = this.selectYear.bind(this);
		this.selectTeam = this.selectTeam.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}
	
	newState(props) {
		const country = seasons.seasons[props.season.country];
		const years = country.years;
		const teams = country.teams[props.season.year];

		return {season: props.season, years: years, teams: teams};
	}

  render() {
    return (
      <div className="TeamSelector">
				{ this.props.showYears &&
					<div>
						<div className="flex-container">
							{seasons.countries.map(country => {
								const url = 'https://img.uefa.com/imgml/flags/50x50/' + country + '.png';

								var style = (country === this.state.season.country) ? 'TeamSelector-selected' : '';

								return (
									<div key={country} className="flex-1 text-center"
											 onClick={() => this.selectCountry(country)}>
										<img src={url} className={'TeamSelector-country ' + style} alt="" />
									</div>
								);
							})}
						</div>
						<div className="TeamSelector-flex-container">
							{this.state.years.map(year => {
								var style = '';
							
								if (year !== this.state.season.year) {
									style = 'TeamSelector-year';
								}

								var yearString = year - 2000;

								if (yearString < 10) {
									yearString = '0' + yearString;
								}

								return (
									<div className={"flex-1 text-center " + style} key={year}
											 onClick={() => this.selectYear(year)}>
										<h3>
											{yearString}
										</h3>
									</div>);
							})}
						</div>
					</div>
				}
				<div className="TeamSelector-flex-container">
					{this.state.teams.map(team => {
						return this.getLogo(team);
					})}
				</div>
				{this.props.showYears &&
					<div>
						<br/>
						<div className="flex-container flex-container-space-around">
							{koreans[this.state.season.year] &&
							 koreans[this.state.season.year].map(korean => {
								return (
									<div key={korean.name} className="text-center">
										<div className={this.getLogoClassName(korean.team)} onClick={() => this.selectKorean(korean)}>
											<EmblemLarge team={korean.team} />
										</div>
										<div>
											{korean.name}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				}
      </div>
    );
  }

	selectCountry(code) {
		const country = seasons.seasons[code];
		const years = country.years;

		var year = this.state.season.year;
		if (country.teams[year] === undefined) {
			year = country.years[0];
		}

		const teams = country.teams[year];
		var team = this.state.season.team;
		if (teams.indexOf(team) === -1) {
			team = teams[0];
		}

		const season = {country: code, year: year, team: team};
		this.setState({season: season, years: years, teams: teams});
	}

	selectYear(year) {
		const country = seasons.seasons[this.state.season.country];
		const teams = country.teams[year];

		var team = this.state.season.team;
		if (teams.indexOf(team) === -1) {
			team = teams[0];
		}

		const season = {country: this.state.season.country, year: year, team: team};
		this.setState({season: season, teams: teams});
	}

	selectTeam(team) {
		var season = this.state.season;
		season.team = team;

		this.props.onSelect(season);
	}

	selectKorean(korean) {
		const season = {country: korean.country, year: this.state.season.year, team: korean.team};
		this.props.onSelect(season);
	}

	getLogo(team) {
		return (
			<div className={this.getLogoClassName(team)} key={team} onClick={() => this.selectTeam(team)}>
				<EmblemLarge team={team} />
			</div>
		);
	}

	getLogoClassName(team) {
		var className = 'TeamSelector-team';
		
		if (team === this.state.season.team) {
			className += ' TeamSelector-selected';
		}

		return className;
	}
}
