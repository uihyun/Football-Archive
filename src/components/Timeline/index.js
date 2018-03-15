import React, { Component } from 'react';

import './style.css';

import {Squad, Competition, Team, Scoreboard} from '../Common';

export default class Timeline extends Component {

	constructor(props) {
		super(props);

		this.state = this.newState(this.props);
		
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
			selectedPlayer: null};
	}

  render() {
    return (
      <div className="Timeline">
				{this.state.matches.map((match, index) => {
					return (
						<div key={index} className="flex-container"
						 onClick={() => this.props.selectMatch(match)}>
							<div className="flex-1 Timeline-margin flex-container-right-aligned">
								<Competition name={match.competition} round={match.round} />
							</div>
							<Scoreboard classNames="Timeline-margin" team={this.props.team} match={match} 
					 		 player={this.state.selectedPlayer}/>
							<div className="flex-1 Timeline-margin Match-team">
								<Team name={match.vs} />
							</div>
						</div>
					);
				})}
				<br/>
				<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
      </div>
    );
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
