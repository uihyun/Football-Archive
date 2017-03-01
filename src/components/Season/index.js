import React, { Component } from 'react';

import './style.css';

import Match from '../Match';

export default class Season extends Component {

	constructor(props) {
		super(props);
		this.state = {
			matches: [],
			showScorers: false,
			showLineup: false, 
			showOtherGames: false,
			selectedPlayer: {}};

		this.selectSeason = this.selectSeason.bind(this);
		
		this.toggleShowScorers = this.toggleShowScorers.bind(this);
		this.toggleShowLineup = this.toggleShowLineup.bind(this);
		this.toggleShowOtherGames = this.toggleShowOtherGames.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentDidMount() {
		this.selectSeason(this.props.season, this.props.team);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.season !== nextProps.season ||
				this.props.team !== nextProps.team) {
			this.selectSeason(nextProps.season, nextProps.team);
		}
	}

  render() {
    return (
      <div className="Season">
				<h3 className="header">
					<button onClick={this.toggleShowScorers}>
						{this.state.showScorers ? 'Hide' : 'Show'} Scorers
					</button>
					<button onClick={this.toggleShowLineup}>
						{this.state.showLineup ? 'Hide' : 'Show'} Lineup
					</button>
				 	{
						this.state.selectedPlayer.number &&
							<button onClick={this.toggleShowOtherGames}>
								{this.state.showOtherGames ? 'Hide' : 'Show'} Other Games
							</button>
					}
        </h3>
				{
					this.state.selectedPlayer.number &&
					<h3 className="header">
						{this.state.selectedPlayer.number} {this.state.selectedPlayer.name}
					</h3>
				}
				{this.state.matches.map(match => {
					return <Match key={match.competition + match.date} match={match} team={this.props.team}
									showScorers={this.state.showScorers} showLineup={this.state.showLineup}
									showOtherGames={this.state.showOtherGames}
									selectPlayer={this.selectPlayer} selectedPlayer={this.state.selectedPlayer}
									/>;
				})}
      </div>
    );
  }

	selectSeason(season, team) {
		const that = this;
		const url = '/api/season/select/' + season + '/' + team.replace(/ /g, '-');
				
		this.setState({matches: [], showScorers: false, showLineup: false, selectedPlayer: {}});

		fetch(url)
			.then(function(response) {
				return response.json();
			})
		.then(function(data) {
			const matches = that.getMatches(data.competitions);
			if (data.season) {
				that.setState({ matches: matches });
			}
		});
	}

	toggleShowScorers() {
		this.setState({ showScorers: !this.state.showScorers });
	}

	toggleShowLineup() {
		if (this.state.showLineup) {
			this.selectPlayer({});
		}
		this.setState({ showLineup: !this.state.showLineup });
	}

	toggleShowOtherGames() {
		this.setState({ showOtherGames: !this.state.showOtherGames });
	}

	selectPlayer(player) {
		if (this.state.selectedPlayer.name === player.name) {
			this.setState({ selectedPlayer: {}, showOtherGames: false });
		}
		else {
			this.setState({ selectedPlayer: player, showOtherGames: false });
		}
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
