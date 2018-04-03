import React, { Component } from 'react';

import './style.css';

import {Team} from '../Common';
import {seasons} from '../data';

import UrlUtil from '../../util/url';

export default class Manage extends Component {

	constructor(props) {
		super(props);

		const selectedCountry = seasons.countries[0];
		const country = seasons.seasons[selectedCountry];
		const selectedYear = country.years[0];
		const teams = country.teams[selectedYear];

		this.state = {
			selectedCountry: selectedCountry,
			selectedYear: selectedYear,
			teams: teams,
			fetchedTeams: {}
		};


		this.selectYear = this.selectYear.bind(this);
		this.fetchSeason = this.fetchSeason.bind(this);
		this.clearSeason = this.clearSeason.bind(this);
		this.fetchMatches = this.fetchMatches.bind(this);
		this.clearMatches = this.clearMatches.bind(this);
		this.fetchAllMatches = this.fetchAllMatches.bind(this);
		this.updateLeague = this.updateLeague.bind(this);
		this.updateSeason = this.updateSeason.bind(this);
	}

	componentDidMount() {
		this.selectYear(this.state.selectedCountry, this.state.selectedYear);
	}

  render() {

    return (
      <div className="Manage">
        <h2 className="text-center">
					{this.state.selectedCountry} {this.state.selectedYear} Season
				</h2>
				<div className="flex-container">
					<div className="flex-1">
						{seasons.countries.map(country => {
							const url = 'https://img.uefa.com/imgml/flags/50x50/' + country + '.png';
							return (
								<div key={country}>
									<img src={url} alt="" />
									<ul>
									{seasons.seasons[country].years.map(year => {
										return <li key={year} onClick={() => this.selectYear(country, year)}>{year}</li>;
									})}
									</ul>
								</div>
							);
						})}
					</div>
					<div className="flex-2">
						<div className="flex-container Manage-team">
							<div className="flex-1" />
							<div className="flex-1">
								<button onClick={() => this.fetchAllMatches()}>
									Fetch All Matches
								</button>
								<button onClick={() => this.updateLeague()}>
									Update League
								</button>
								<button onClick={() => this.updateSeason()}>
									Update Season
								</button>
							</div>
						</div>
						{this.state.teams.map(team => {
							return (
								<div className="flex-container Manage-team" key={team}>
									<div className="flex-1">
										<Team team={team} />
									</div>
									<div className="flex-1">
										{ this.state.fetchedTeams[team] ?
											<button className="Manage-clear-btn" onClick={() => this.clearSeason(team)}>
												Clear Season
											</button>
											:
											<button onClick={() => this.fetchSeason(team)}>
												Fetch Season
											</button>
										}
										{/*
										<button onClick={() => this.fetchMatches(team)}>
											Fetch Matches
										</button>
										<button className="Manage-clear-btn" onClick={() => this.clearMatches(team)}>
											Clear Matches
										</button>
										*/}
									</div>
								</div>
							);
						})}
					</div>
				</div>
      </div>
    );
  }

	selectYear(country, year) {
		const that = this;
		const url = '/api/season/select/' + year;
		const teams = seasons.seasons[country].teams[year];

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				var fetchedTeams = {};
				var team, i, j;
				for (i in data) {
					if (data[i]) {
						for (j = 0; j < teams.length; j++) {
							team = teams[j];
							if (team === data[i].team) {
								fetchedTeams[team] = true;
							}
						}
					}
				}

				that.setState({
					selectedCountry: country,
					selectedYear: year,
					teams: teams,
					fetchedTeams: fetchedTeams
				});
			});
	}

	fetchSeason(team) {
		const that = this;
		const url = UrlUtil.getSeasonFetchUrl(this.state.selectedYear, team);

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				that.selectYear(that.state.selectedCountry, that.state.selectedYear);
			});
	}

	clearSeason(team) {
		const that = this;
		const url = UrlUtil.getSeasonClearUrl(this.state.selectedYear, team);

		fetch(url)
			.then(function(response) {
				that.selectYear(that.state.selectedCountry, that.state.selectedYear);
			})
	}

	fetchMatches(team) {
		const that = this;
		const url = UrlUtil.getMatchFetchUrl(this.state.selectedYear, team);

		fetch(url)
			.then(function(response) {
				that.selectYear(that.state.selectedCountry, that.state.selectedYear);
			});
	}

	clearMatches(team) {
		const that = this;
		const url = UrlUtil.getMatchClearUrl(this.state.selectedYear, team);

		fetch(url)
			.then(function(response) {
				that.selectYear(that.state.selectedCountry, that.state.selectedYear);
			});
	}

	getLeagues(year) {
		var leagues = [];
		var i, country;

		for (i = 0; i < seasons.countries.length; i++) {
			country = seasons.countries[i];

			if (seasons.seasons[country].teams[year]) {
				leagues.push(seasons.seasons[country].league);
			}
		}

		return leagues.join('_');
	}

	fetchAllMatches() {
		const year = this.state.selectedYear;
		const leagues = this.getLeagues(year);
		const url = '/api/match/fetch-season/' + year;

		fetch(url)
			.then(function(response) {
				const url = '/api/league/update/' + year + '?leagues=' + leagues;
				fetch(url)
					.then(function(response) {
						const url = '/api/cup/update/' + year;
						fetch(url)
							.then(function(response) {
								alert('Fetch All Matches: Done');
							});
					});
			});
	}
	
	updateLeague() {
		const year = this.state.selectedYear;
		const leagues = this.getLeagues(year);
		const url = '/api/league/update/' + year + '?leagues=' + leagues;

		fetch(url, {leagues: leagues})
			.then(function(response) {
				alert('Update League: Done');
			});
	}
	
	updateSeason() {
		const that = this;
		const url = '/api/season/update/' + that.state.selectedYear;
		
		fetch(url)
			.then(function(response) {
				alert('Update Season: Done');
			});
	}
}
