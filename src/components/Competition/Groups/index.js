import React, { Component } from 'react';

import './style.css';

import { Grid, LeagueTable, ViewSelector } from '../../Common';
	
export default class Groups extends Component {
	
	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}

	getViews() {
		const groups = this.props.groups;
		var i, group;
		var views = [];

		for (i = 0; i < groups.length; i++) {
			group = groups[i];

			views.push({
				name: group.name.replace(/Group /, ''),
				view: (
					<div>
						<LeagueTable league={group} />
						<br/>
						<Grid matches={this.groupMatches(group)} year={this.props.comp.season} />
					</div>
				)
			});
		}

		return views;
	}

	groupMatches(group) {
		var matches = [];

		var i, match;
		var j, teamA;
		var k, teamB;
		var teams, index;

		for (i = 0; i < group.matches.length; i++) {
			match = group.matches[i];
			for (j = 0; j < group.table.length; j++) {
				teamA = group.table[j].name;
				for (k = 0; k < group.table.length; k++) {
					teamB = group.table[k].name;
					if (j === k)
						continue;

					if (match.l === teamA && match.r === teamB) {
						if (group.matches.length === group.table.length * (group.table.length - 1) ||
							j < k) {
							teams = [match.l, match.r];
							index = k * 4 + j;
						} else {
							teams = [match.r, match.l];
							index = j * 4 + k;
						}

						matches[index] = {
							teams: teams,
							matches: [match]
						};
					}
				}
			}
		}

		return matches;
	}
}
