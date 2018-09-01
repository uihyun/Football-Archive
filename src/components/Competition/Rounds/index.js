import React, { Component } from 'react';

import './style.css';

import { PageSelector } from '../../Common';

import Finals from './finals';
import Grid from './grid';

import { rounds as roundData } from '../data';

import MatchUtil from '../../../util/match';

export default class Rounds extends Component {
	
	render() {
		return (
			<PageSelector views={this.getViews()} basename={this.props.basename} />
		);
	}

	getViews() {
		const comp = this.props.data.comp;
		const [earlyRounds, finals] = this.groupFinals();
		var views = [];
		var i, round, group, name;

		if (finals.length > 0) {

			views.push({
				name: 'Finals',
				link: '/finals',
				component: Finals,
				data: { finals: finals, year: comp.season }
			});
		}

		for (i = 0; i < earlyRounds.length; i++) {
			round = earlyRounds[i];
			group = MatchUtil.groupMatches(round.matches);
			name = round.name.replace(/\./, '');
			name = name.replace(/Zwischenrunde/, 'Play-off');

			views.push({
				name: name,
				sh: roundData.getShortForm(comp.name, name),
				link: '/' + name.replace(/ /g, '-'),
				component: Grid,
				data: { matches: group, year: comp.season }
			});
		}

		return views;
	}


	groupFinals() {
		const rounds = this.props.data.rounds;
		var earlyRounds = [];
		var third = null;
		var finals = [];
		var i, round;
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name === 'Final' ||
					round.name === 'Semi-finals' ||
					round.name === 'Quarter-finals') {
				finals.push({name: round.name, group: MatchUtil.groupMatches(round.matches)});
			} else if (round.name === 'Third place' || round.name === '3td place') {
				third = {name: '3/4', group: MatchUtil.groupMatches(round.matches)};
			} else {
				earlyRounds.push(round);
			}
		}
		
		var prev, group;
		var j, k, l;

		for (i = 1; i < finals.length; i++) {
			prev = finals[i - 1];
			round = finals[i];
			group = [];

			for (j = 0; j < prev.group.length; j++) {
				for (k = 0; k < round.group.length; k++) {
					for (l = 0; l < 2; l++) {
						if (round.group[k].teams.includes(prev.group[j].teams[l])) {
							group[j * 2 + l] = round.group[k];
						}
					}
				}
			}

			round.group = group;
		}

		if (third !== null) {
			finals.push(third);
		}

		return [earlyRounds, finals];
	}
}
