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
		const rounds = this.props.rounds;
		var views = [];
		var i, round, group, rows, name;

		console.log(rounds);

		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];
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
}
