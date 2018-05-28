import React, { Component } from 'react';

import './style.css';

import { Team } from '../Common';
import { clubs, nations, kleague } from '../data';

import UrlUtil from '../../util/url';

export default class Manage extends Component {

	constructor(props) {
		super(props);

		const selectedCountry = 'Club';
		const selectedYear = clubs.years.max;

		this.state = {
			selectedCountry: selectedCountry,
			selectedYear: selectedYear,
			teams: [],
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
		this.updateCup = this.updateCup.bind(this);
		this.fetchAllSeasons = this.fetchAllSeasons.bind(this);
	}

	componentDidMount() {
		this.selectYear(this.state.selectedCountry, this.state.selectedYear);
	}

  render() {

		var clubYears = this.getYears(clubs.years);
		var nationYears = this.getYears(nations.years);

    return (
      <div className="Manage">
        <h2 className="text-center">
					{this.state.selectedCountry.toUpperCase()} {this.state.selectedYear} Season
				</h2>
				<div className="flex-container">
					<div className="flex-1">
						<div>
							Clubs
							<ul>
							{clubYears.map(year => {
								return <li key={year} onClick={() => this.selectYear('Club', year)}>{year}</li>;
							})}
							</ul>
						</div>
						<div>
							Nations
							<ul>
							{nationYears.map(year => {
								return <li key={year} onClick={() => this.selectYear('FIFA', year)}>{year}</li>;
							})}
							</ul>
						</div>
					</div>
					<div className="flex-2">
						<div className="flex-container Manage-team">
							<div className="flex-1">
								<button onClick={() => this.fetchAllMatches()}>
									Fetch All Matches
								</button>
								<button onClick={() => this.updateLeague()}>
									Update League
								</button>
								<button onClick={() => this.updateCup()}>
									Update Cup
								</button>
								<button onClick={() => this.clearMatches()}>
									Clear Recent Matches
								</button>
								<button onClick={() => this.updateSeason()}>
									Update Season
								</button>
								<button onClick={() => this.fetchAllSeasons()}>
									Fetch All Seasons
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
									</div>
								</div>
							);
						})}
					</div>
				</div>
      </div>
    );
  }

	getYears(years) {
		var array = [];
		var i;

		for (i = years.min; i <= years.max; i++) {
			array.push(i);
		}

		array.reverse();
		return array;
	}

	getClubTeams(year) {
		var i, teams;
		var array = [];

		for (i = 0; i < clubs.countries.length; i++) {
			teams = clubs.seasons[clubs.countries[i]].teams[year];

			if (teams) {
				array = array.concat(teams);
			}
		}

		return array;
	}

	getNationTeams() {
		var i, j, countries;
		var teams = [];

		for (i = 0; i < nations.confederations.length; i++) {
			countries = nations.countries[nations.confederations[i]];

			for (j = 0; j < countries.length; j++) {
				teams.push(countries[j]);
			}
		}

		return teams;
	}

	selectYear(country, year) {
		const that = this;
		const url = '/api/season/select/' + year;
		var teams = [];

		if (country === 'FIFA') {
			teams = this.getNationTeams();
		} else {
			teams = this.getClubTeams(year);
		}

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

	fetchAllSeasons() {
		const that = this;
		const year = this.state.selectedYear;
		const teams = this.state.teams;
		
		var i, url;
		var promises = [];

		for (i = 0; i < teams.length; i++) {
			if (this.state.fetchedTeams[teams[i]] !== true) {
				url = UrlUtil.getSeasonFetchUrl(year, teams[i]);
				promises.push(fetch(url));
			}
		}

		Promise.all(promises)
			.then(function(data) {
				that.selectYear(that.state.selectedCountry, that.state.selectedYear);
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
		const url = UrlUtil.getMatchClearUrl(this.state.selectedYear);

		fetch(url)
			.then(function(response) {
				alert('Clear Recent Matches: Done');
			});
	}

	getLeagues(year) {
		var leagues = [];
		var i, country, league;

		for (i = 0; i < clubs.countries.length; i++) {
			country = clubs.countries[i];

			if (clubs.seasons[country].teams[year]) {
				leagues.push(clubs.seasons[country].league);
			}
		}
		
		for (i = 0; i < kleague.leagues.length; i++) {
			league = kleague.leagues[i];

			if (kleague.seasons[league].teams[year]) {
				leagues.push(league);
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
						alert('Fetch All Matches: Done');
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
		const year = this.state.selectedYear;
		const url = '/api/season/update/' + year;
		
		fetch(url)
			.then(function(response) {
				alert('Update Season: Done');
			});
	}
	
	updateCup() {
		const year = this.state.selectedYear;
		const url = UrlUtil.getCupFetchUrl(year);
		
		fetch(url)
			.then(function(response) {
				alert('Update Cup: Done');
			});
	}
}
