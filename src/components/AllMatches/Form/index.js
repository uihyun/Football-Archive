import React, { Component } from 'react';

import './style.css';

import Timeline from '../Timeline';

import Match from '../../../util/match';

export default class Form extends Component {
  
	render() {
		let allMatches = Match.extractAndSort(this.props.data);
		let sum = this.getMatchSummary(allMatches);

		const data = this.getShortenedData(allMatches);
		const props = this.props;
		
		return (
			<div className="Form">
				<div className="flex-container text-center">
					<div className="flex-1">
						W <b>{sum.win}</b> D <b>{sum.draw}</b> L <b>{sum.loss}</b>
					</div>
					<div className="flex-1">
						{sum.unplayed} more game{sum.unplayed > 0 ? 's' : ''}
					</div>
				</div>
				<Timeline data={data} squad={props.squad} team={props.team} year={props.year} player={props.player} />
				{this.getSeparator(sum.unplayed)}
			</div>
		);
	}

	getShortenedData(allMatches) {
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

		var compMap = {};
		for (i = startIndex; i <= endIndex; i++) {
			match = allMatches[i];

			if (compMap[match.competition] === undefined) {
				compMap[match.competition] = {name: match.competition, matches: []};
			}

			compMap[match.competition].matches.push(match);
		}
		
		var data = {competitions: []};
		for (i in compMap) {
			if (compMap[i]) {
				data.competitions.push(compMap[i]);
			}
		}

		return data;
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
}
