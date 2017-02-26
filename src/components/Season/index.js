import React, { Component } from 'react';

import './style.css';

import Match from '../Match';

export default class Season extends Component {

	constructor(props) {
		super(props);
		this.state = {season: 2017, seasonString: '2016-2017', matches: [],
									showScorers: false, showLineup: false, selectedPlayer: {}};

		this.selectSeason = this.selectSeason.bind(this);
		this.fetchSeason = this.fetchSeason.bind(this);
		this.clearSeason = this.clearSeason.bind(this);
		
		this.toggleShowScorers = this.toggleShowScorers.bind(this);
		this.toggleShowLineup = this.toggleShowLineup.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentDidMount() {
		this.selectSeason();
	}

  render() {
    return (
      <div className="Season">
        <h1 className="header">
          {this.state.seasonString} Season
					<button onClick={this.fetchSeason}>
						Fetch
					</button>
					<button onClick={this.clearSeason}>
						Clear
					</button>
					<button onClick={this.toggleShowScorers}>
						{this.state.showScorers ? 'Hide' : 'Show'} Scorers
					</button>
					<button onClick={this.toggleShowLineup}>
						{this.state.showLineup ? 'Hide' : 'Show'} Lineup
					</button>
        </h1>
				{
					this.state.selectedPlayer.number &&
					<h2 className="header">
						{this.state.selectedPlayer.number} {this.state.selectedPlayer.name}
					</h2>
				}
				{this.state.matches.map(match => {
					return <Match key={match.competition + match.date} match={match} onUpdate={this.selectSeason}
									showScorers={this.state.showScorers} showLineup={this.state.showLineup}
									selectPlayer={this.selectPlayer} selectedPlayer={this.state.selectedPlayer}								
									/>;
				})}
      </div>
    );
  }

	selectSeason() {
		const that = this;
		const url = '/api/season/select/' + this.state.season;

		fetch(url)
			.then(function(response) {
				return response.json();
			})
		.then(function(data) {
			const matches = that.getMatches(data.competitions);
			const seasonString = data.season - 1 + '-' + data.season;
			that.setState({ seasonString: seasonString, matches: matches });
		});
	}

	fetchSeason() {
		const that = this;
		const url = '/api/season/fetch/' + this.state.season;

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				const matches = that.getMatches(data.competitions);
				console.log(data);
				that.setState({ matches: matches });
			});
	}

	clearSeason() {
		const that = this;
		const url = '/api/season/clear/' + this.state.season;

		fetch(url)
			.then(function(response) {
				console.log(response);
				that.setState({ matches: [] });
			})
	}

	toggleShowScorers() {
		this.setState({ showScorers: !this.state.showScorers });
	}

	toggleShowLineup() {
		this.setState({ showLineup: !this.state.showLineup });
	}

	selectPlayer(player) {
		this.setState({ selectedPlayer: player });
	}

	getMatches(competitions) {
		var out = [];
		var competition;
		var match;

		if (competitions === undefined)
			return out;

		for (var i = 0; i < competitions.length; i++) {
			competition = competitions[i];

			for (var j = 0; j < competition.matches.length; j++) {
				match = JSON.parse(JSON.stringify(competition.matches[j]));
				match.competition = competition.name;
				match.dateO = new Date(match.date);
				out.push(match);
			}
		}

		out.sort(function(a, b) {
			a = a.dateO;
			b = b.dateO;
			return a > b ? 1 : a < b ? -1 : 0;
		});

		return out;
	}
}
