import React, { Component } from 'react';

import './style.css';

import Timeline from '../Timeline';

import { colors } from '../data';

import Match from '../../../util/match';

export default class Form extends Component {
  
	render() {
		let allMatches = Match.extractAndSort(this.props.data.data);
		let sum = this.getMatchSummary(allMatches);

		const props = this.props.data;
		const data = {
			data: Match.getShortenedData(allMatches),
			squad: props.squad, team: props.team, year: props.year, player: props.player
		};
		
		return (
			<div className="Form">
				<div className="flex-container text-center">
					<div className="flex-1 flex-container">
						<div className="flex-3 hide-mobile" />
						<div className="flex-1" style={{backgroundColor: colors.lightblue}}>
							W <b>{sum.win}</b>
						</div>
						<div className="flex-1" style={{backgroundColor: colors.lightyellow}}>
							D <b>{sum.draw}</b>
						</div>
						<div className="flex-1" style={{backgroundColor: colors.lightred}}>
							L <b>{sum.loss}</b>
						</div>
						<div className="flex-3 hide-mobile" />
					</div>
					<div className="flex-1">
						{sum.unplayed} more game{sum.unplayed > 0 ? 's' : ''}
					</div>
				</div>
				<br/>
				<Timeline data={data} />
				{this.getSeparator(sum.unplayed)}
			</div>
		);
	}

	getMatchSummary(matches) {
		var sum = {win: 0, draw: 0, loss: 0, unplayed: 0};

		matches.forEach(match => {
			const summary = Match.summarizeResult(match, this.props.data.team);

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
}
