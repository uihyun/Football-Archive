import React, { Component } from 'react';

import './style.css';

import Scoreboard from '../Scoreboard';

import teams from '../../data/teams';

export default class SeasonSummary extends Component {

	constructor(props) {
		super(props);
		this.state = {
			league: []
		};

		this.selectSeason = this.selectSeason.bind(this);
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
		function displayRank(rank) {
			if (rank === 1) {
				return rank + 'st';
			} else if (rank === 2) {
				return rank + 'nd';
			} else {
				return rank + 'th';
			}
		}
    return (
			<div>
				{this.state.league.map(team => {
					var logoID = 2608043;

					if (teams[team.name] !== undefined) {
						logoID = teams[team.name].id;
					}

					var imgSrc = 'http://img.uefa.com/imgml/TP/teams/logos/50x50/' + logoID + '.png';

					return (
						<div className="flex-container Season-Summary-team" key={team.name}>
							<div className="flex-1 flex-container-right-aligned">
								<div>
									<img src={imgSrc} className="Season-Summary-logo" alt="" />
								</div>
							</div>

							{
								team.name === this.props.team
								? <div className="Season-Summary-self">{displayRank(team.rank)}</div>
								: team.matches.map(match => {
									return (<Scoreboard classNames="" key={match.place} team={this.props.team} match={match} />);
								})
							}
							<div className="flex-1"></div>
						</div>
					);
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
			if (data.season) {
				that.setState({ league: that.getTable(data) });
			}
		});
	}

	getTable(data) {
		var leagueName = data.leagues[0].name;
		
		var i;
		var entry;
		var table = [];
		var teams = {};
		for (i = 0; i < data.leagues[0].table.length; i++) {
			entry = data.leagues[0].table[i];
			table[i] = { name: entry.name, matches: [], rank: entry.rank };
			teams[entry.name] = table[i];
		}

		var j;
		var match;
		var team;
		for (i = 0; i < data.competitions.length; i++) {
			entry = data.competitions[i];

			if (entry.name === leagueName) {
				for (j = 0; j < entry.matches.length; j++) {
					match = entry.matches[j];

					team = teams[match.vs];

					if (match.place === 'A') {
						team.matches[1] = match;
					} else {
						team.matches[0] = match;
					}
				}
			}
		}

		return table;
	}
}
