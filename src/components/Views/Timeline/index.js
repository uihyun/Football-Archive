import React, { Component } from 'react';

import './style.css';

import Match from '../../Match';
import Squad from '../../Squad';

export default class Timeline extends Component {

	constructor(props) {
		super(props);

		this.state = this.newState(this.props);
		
		this.toggleShowScorers = this.toggleShowScorers.bind(this);
		this.toggleShowLineup = this.toggleShowLineup.bind(this);
		this.toggleShowOtherGames = this.toggleShowOtherGames.bind(this);
		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

	newState(props) {
		const matches = this.getMatches(props.data.competitions);

		return {
			matches: matches,
			squad: [],
			showScorers: false,
			showLineup: false, 
			showOtherGames: false,
			selectedPlayer: null};
	}

  render() {
    return (
      <div className="Season">
				<h3 className="text-center">
					<button onClick={this.toggleShowScorers}>
						{this.state.showScorers ? 'Hide' : 'Show'} Scorers
					</button>
					<button onClick={this.toggleShowLineup}>
						{this.state.showLineup ? 'Hide' : 'Show'} Lineup
					</button>
				 	{
						this.state.selectedPlayer &&
						this.state.showLineup &&
							<button onClick={this.toggleShowOtherGames}>
								{this.state.showOtherGames ? 'Hide' : 'Show'} Other Games
							</button>
					}
        </h3>
				{this.state.matches.map(match => {
					return <Match key={match.competition + match.date} match={match} team={this.props.team}
									showScorers={this.state.showScorers} showLineup={this.state.showLineup}
									showOtherGames={this.state.showOtherGames}
									selectedPlayer={this.state.selectedPlayer}
									/>;
				})}
				<br/>
				<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
      </div>
    );
  }

	toggleShowScorers() {
		this.setState({ showScorers: !this.state.showScorers });
	}

	toggleShowLineup() {
		this.setState({ showLineup: !this.state.showLineup });
	}

	toggleShowOtherGames() {
		this.setState({ showOtherGames: !this.state.showOtherGames });
	}

	selectPlayer(player) {
		this.setState({ selectedPlayer: player, showOtherGames: false });
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
