import React, { Component } from 'react';

import './style.css';

import { Grid, ViewSelector } from '../../Common';

import { rounds as roundData } from '../data';

export default class Rounds extends Component {
	
	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}

	getViews() {
		const comp = this.props.comp;
		const [earlyRounds, finals] = this.groupFinals();
		var views = [];
		var i, round, group, name;

		if (finals.length > 0) {
			const style = {
				fontSize: '1.5em',
				textAlign: 'center'
			};

			views.push({
				name: 'Finals',
				view: (
					<div>
						<br/>
						{finals.map(round => {
							return (
								<div key={round.name}>
									<div style={style}>{round.name}</div>
									<Grid matches={round.group} year={this.props.comp.season} noFiller={true} />
								</div>
							);
						})}
					</div>
				)
			});

		}

		for (i = 0; i < earlyRounds.length; i++) {
			round = earlyRounds[i];
			group = this.groupMatches(round.matches);
			name = round.name.replace(/\./, '');

			views.push({
				name: name,
				sh: roundData.getShortForm(comp.name, name),
				view: (
					<div>
						<br/>
						<Grid matches={group} year={this.props.comp.season} />
					</div>
				)
			});
		}

		return views;
	}

	groupMatches(matches) {
		var group = [];

		var i, match;
		var j, entry;
		var found;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			found = false;

			for (j = 0; j < group.length; j++) {
				entry = group[j];

				if (entry.teams.includes(match.l)) {
					entry.matches.push(match);
					found = true;
					break;
				}
			}

			if (found === false) {
				group.push({
					teams: [match.l, match.r],
					matches: [match]
				});
			}
		}

		return group;
	}

	groupFinals() {
		const rounds = this.props.rounds;
		var earlyRounds = [];
		var finals = [];
		var i, round;
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name === 'Final' ||
					round.name === 'Semi-finals' ||
					round.name === 'Quarter-finals') {
				finals.push({name: round.name, group: this.groupMatches(round.matches)});
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

		return [earlyRounds, finals];
	}
}
