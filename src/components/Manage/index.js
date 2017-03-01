import React, { Component } from 'react';

import './style.css';

import Team from '../Team';
import seasons from '../../data/seasons';

export default class Manage extends Component {

	constructor(props) {
		super(props);
		
		var seasonList = {};
		var yearArray = [];
		var season, year, i;

		for (i in seasons) {
			if (seasons[i]) {

				season = seasons[i];
				year = season.year;

				yearArray.push(year);
				seasonList[year] = season.teams;
			}
		}

		var maxYear = 0;
		for (i = 0; i < yearArray.length; i++) {
			year = yearArray[i];
			if (year > maxYear) {
				maxYear = year;
			}
		}

		this.state = {selectedYear: maxYear, years: yearArray, seasons: seasonList, fetchedTeams: {}}

		this.selectYear = this.selectYear.bind(this);
		this.fetchSeason = this.fetchSeason.bind(this);
		this.clearSeason = this.clearSeason.bind(this);
		this.fetchMatches = this.fetchMatches.bind(this);
	}

	componentDidMount() {
		this.selectYear(this.state.selectedYear);
	}

  render() {

    return (
      <div className="Manage">
        <h2 className="header">
          {this.state.selectedYear} Season
				</h2>
				<div className="flex-container">
					<div className="flex-1">
						<ul>
							{this.state.years.map(year => {
								return <li key={year} onClick={() => this.selectYear(year)}>{year}</li>;
							})}
						</ul>
					</div>
					<div className="flex-2">
						{this.state.seasons[this.state.selectedYear].map(team => {
							return (
								<div className="flex-container team" key={team}>
									<div className="flex-1">
										<Team name={team} />
									</div>
									<div className="flex-1">
										{ this.state.fetchedTeams[team] ?
											<button className="clear-btn" onClick={() => this.clearSeason(team)}>
												Clear Season
											</button>
											:
											<button onClick={() => this.fetchSeason(team)}>
												Fetch Season
											</button>
										}
										<button onClick={() => this.fetchMatches(team)}>
											Fetch Matches
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
      </div>
    );
  }

	selectYear(year) {
		const that = this;
		const url = '/api/season/select/' + year;

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				var teams = {};
				var team;
				for (var i in data) {
					if (data[i]) {
						for (var j in that.state.seasons[year]) {
							if (that.state.seasons[year][j]) {
								team = that.state.seasons[year][j];
								if (team.toUpperCase() === data[i].team.toUpperCase()) {
									teams[team] = true;
								}
							}
						}
					}
				}
				
				that.setState({ selectedYear: year, fetchedTeams: teams });
			});
	}

	fetchSeason(team) {
		const that = this;
		const url = '/api/season/fetch/' + this.state.selectedYear + '/' + team.replace(/ /g, '-');

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				that.selectYear(that.state.selectedYear);
			});
	}

	clearSeason(team) {
		const that = this;
		const url = '/api/season/clear/' + this.state.selectedYear + '/' + team.replace(/ /g, '-');

		fetch(url)
			.then(function(response) {
				console.log(response);
				that.selectYear(that.state.selectedYear);
			})
	}

	fetchMatches(team) {
		const that = this;
		const url = '/api/match/fetch-season/' + this.state.selectedYear + '/' + team.replace(/ /g, '-');

		fetch(url)
			.then(function(response) {
				that.selectYear(that.state.selectedYear);
			});
	}
}
