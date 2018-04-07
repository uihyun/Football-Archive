import React, { Component } from 'react';

import './style.css';

import {Squad, Competition, Team, Scoreboard} from '../Common';

import Match from '../../util/match';
import SquadUtil from '../../util/squad';

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
		const matches = Match.extractAndSort(props.data);
		const shortenedMatches = this.getShortenedMatches(matches);
		const shortenedSquad = this.getShortenedSquad(props.team, shortenedMatches);

		return {
			matches: matches,
			shortenedMatches: shortenedMatches,
			shortenedSquad: shortenedSquad,
			showAll: false,
			selectedPlayer: null};
	}

  render() {
		var mobile = this.getMobileView();

    return (
      <div className="Timeline">
				<br/>
				<div className="hide-mobile">
					{this.getDesktopView()}	
					<br/>
					<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
				</div>
				<div className="show-mobile">
					{mobile.view}	
					<br/>
					<Squad squad={mobile.squad} selectPlayer={this.selectPlayer} />
				</div>
      </div>
    );
  }

	selectPlayer(player) {
		this.setState({ selectedPlayer: player });
	}

	showAll() {
		this.setState({ showAll: true, selectedPlayer: null });
	}

	getDesktopView() {
		return (
			<div className="hide-mobile">
				{this.getMatchesView(this.state.matches)}
			</div>
		);
	}

	getShortenedMatches(allMatches) {
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

		return matches;
	}

	getShortenedSquad(team, matches) {
		return SquadUtil.getSquadArray({team: team, competitions: [{matches: matches}]});
	}
	
	getMobileView() {
		let allMatches = this.state.matches;
		let sum = this.getMatchSummary(allMatches);

		if (this.state.showAll || sum.unplayed === 0) {
			return {squad: this.props.squad, view: this.getMatchesView(this.state.matches)};
		}

		const matches = this.state.shortenedMatches;
		
		var view = (
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
				{this.getSeparator(sum.unplayed)}
			</div>
		);
		
		return {squad: this.state.shortenedSquad, view: view};
	}

	getMatchSummary(matches) {
		var sum = {win: 0, draw: 0, loss: 0, unplayed: 0};

		matches.forEach(match => {
			const summary = Match.summarizeResult(match, this.props.team);

			sum[summary.result]++;
		});

		return sum;
	}

	getSeparator(unplayed) {
		return unplayed > 5 ? <div className="text-center">▼</div> : null;
	}

	getMatchesView(matches) {
		return matches.map((match, index) => {return this.getMatchView(match, index);});
	}

	getMatchView(match, index) {
		return (
			<div key={index} className="flex-container">
				<div className="flex-1 Timeline-margin flex-container-right-aligned">
					<Competition name={match.competition} round={match.round} />
				</div>
				<Scoreboard classNames="Timeline-margin" team={this.props.team} match={match} 
				 player={this.state.selectedPlayer}/>
				<div className="flex-1 Timeline-margin Match-team">
					<Team team={match.vs} year={this.props.year} />
				</div>
			</div>
		);
	}
}
