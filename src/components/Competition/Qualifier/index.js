import React, { Component } from 'react';

import './style.css';

import { LeagueTable, PageSelector } from '../../Common';

import Group from './group';
import Rounds from '../Rounds';

export default class QualificationView extends Component {

	render() {
		return (
			<PageSelector views={this.getViews()} basename={this.props.basename} />
		);
	}
	
	getViews() {
		const qual = this.props.qual;
		var views = [];
		var rounds = this.getRounds();
		var link;

		if (Array.isArray(qual))
			qual.season = qual.season.reverse()[0];

		rounds.forEach(round => {
			link = '/' + round.name.replace(/ /g, '-');

			if (round.groups) {
				round.rounds = round.groups;

				if (round.rounds[0].name.match(/Group$/)) {
					views.push({
						name: round.name,
						link: link,
						component: LeagueTable,
						data: { league: round.groups[0] }
					});
				} else {
					views.push({
						name: round.name,
						link: link,
						component: Group,
						data: { round: round, qual: qual, group: round.groups, 
							basename: this.props.basename + link }
					});
				}
			} else if (round.rounds) {
				views.push({
					name: round.name,
					link: link,
					component: Rounds,
					data: { comp: qual, rounds: round.rounds }
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
		var newRound;
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
			newRound = {
				name: round.name.replace(/.*Round /, ''),
				matches: round.matches,
				table: round.table
			};

			if (round.name.includes('Group')) {
				if (round.name.includes('Round')) {
					roundIndex = round.name.substring(0, 1);
					if (curRound === undefined || roundIndex !== curRound) {
						curRound = roundIndex;
						cur = {name: curRound + ' Round', groups: []};
						groupedRounds.push(cur);
					}
				}

				if (cur === undefined) {
					cur = {name: groupedRounds.length + 1 + ' Round', groups: []};
					groupedRounds.push(cur);
				}

				cur.groups.push(newRound);
			} else {
				groupedRounds.push({
					name: round.name,
					rounds: [newRound]
				});
			}
		}

		groupedRounds.reverse();

		return groupedRounds;
	}
}
