import React, { Component } from 'react';

import './style.css';

import {Squad, Competition, Team, Scoreboard} from '../Common';

import Match from '../../util/match';

export default class Timeline extends Component {

	constructor(props) {
		super(props);

		this.state = this.newState(this.props);
		
		this.selectPlayer = this.selectPlayer.bind(this);
		this.showAll = this.showAll.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

	newState(props) {
		const matches = this.getMatches(props.data.competitions);

		return {
			matches: matches,
			squad: [],
			showAll: false,
			selectedPlayer: null};
	}

  render() {
    return (
      <div className="Timeline">
				<br/>
				{this.getDesktopView()}	
				<div className="show-mobile">
					{this.getMobileView()}	
				</div>
				<br/>
				<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
      </div>
    );
  }

	selectPlayer(player) {
		this.setState({ selectedPlayer: player });
	}

	showAll() {
		this.setState({ showAll: true });
	}

	getDesktopView() {
		return (
			<div className="hide-mobile">
				{this.getMatchesView(this.state.matches)}
			</div>
		);
	}
	
	getMobileView() {
		let allMatches = this.state.matches;
		let sum = this.getMatchSummary(allMatches);

		if (this.state.showAll || sum.unplayed === 0) {
			return this.getMatchesView(this.state.matches);
		}

		var i, match;
		var lastMatchIndex;
		for (i = allMatches.length - 1; i >= 0; i--) {
			match = allMatches[i];

			if (match.summary) {
				lastMatchIndex = i;
				break;
			}
		}

		let startIndex = Math.max(lastMatchIndex - 5, 0);
		let endIndex = Math.min(lastMatchIndex + 5, allMatches.length - 1);

		var matches = [];
		for (i = startIndex; i <= endIndex; i++) {
			matches.push(allMatches[i]);
		}

		
		return (
			<div>
				<div className="flex-container text-center" onClick={() => this.showAll()}>
					<div className="flex-1">
						W <b>{sum.win}</b> D <b>{sum.draw}</b> L <b>{sum.loss}</b>
					</div>
					<div className="flex-1">
						{sum.unplayed} more game{sum.unplayed > 0 ? 's' : ''}
					</div>
				</div>
				<br/>
				{this.getMatchesView(matches)}
				{this.getSeparator(endIndex, allMatches.length - 1)}
			</div>
		);
	}

	getMatchSummary(matches) {
		var sum = {win: 0, draw: 0, loss: 0, unplayed: 0};

		matches.forEach(match => {
			const summary = Match.summarizeResult(match, this.props.team);

			sum[summary.result]++;
		});

		return sum;
	}

	getSeparator(a, b) {
		return b > a ? <div className="text-center">▼</div> : null;
	}

	getMatchesView(matches) {
		return matches.map((match, index) => {return this.getMatchView(match, index);});
	}

	getMatchView(match, index) {
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
