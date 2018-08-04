import React, { Component } from 'react';

import './style.css';

import { Cup, LeagueTable, ViewSelector } from '../../Common';

import Groups from '../Groups';
import Rounds from '../Rounds';

export default class CompetitionView extends Component {

	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}
	
	getViews() {
		const qual = this.props.qual;
		var views = [];
		var rounds = this.getRounds();

		rounds.forEach(round => {
			if (round.groups) {
				round.rounds = round.groups;

				if (round.rounds[0].name.match(/Group$/)) {
					views.push({
						name: round.name,
						view: <LeagueTable league={round.groups[0]} />
					});
				} else {
					views.push({
						name: round.name,
						view: (
							<div>
								<Cup cup={round} onlyGroup={true} />
								<br/>
								<Groups comp={qual} groups={round.groups} />
							</div>
						)
					});
				}
			} else if (round.rounds) {
				views.push({
					name: round.name,
					view: <Rounds comp={qual} rounds={round.rounds} />
				});
			}
		});
		
		return views;
	}
	
	getRounds() {
		const rounds = this.props.qual.rounds;
		var groupedRounds = [];

		var i, round;
		var curRound, cur, roundIndex;
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name.includes('Group')) {
				if (round.name.includes('Round')) {
					roundIndex = round.name.substring(0, 1);
					if (curRound === undefined || roundIndex !== curRound) {
						curRound = roundIndex;
						cur = {name: curRound + ' Round', groups: []};
						groupedRounds.push(cur);
					}
					round.name = round.name.replace(/.*Round /, '');
				}

				if (cur === undefined) {
					cur = {name: groupedRounds.length + 1 + ' Round', groups: []};
					groupedRounds.push(cur);
				}

				cur.groups.push(round);
			} else {
				groupedRounds.push({
					name: round.name,
					rounds: [round]
				});
			}
		}

		groupedRounds.reverse();

		return groupedRounds;
	}
}
