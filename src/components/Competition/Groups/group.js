import React, { Component } from 'react';

import './style.css';

import { Grid, LeagueTable } from '../../Common';
	
export default class Group extends Component {

	render() {
		const group = this.props.data.group;
		var grid = null;

		if ((group.table.length <= 4) ||
				(group.table.length === 5 && group.matches.length === 20)) {
			grid = <Grid matches={this.groupMatches(group)} year={this.props.data.comp.season} />;
		}

		return (
			<div>
				<LeagueTable league={group} />
				<br/>
				{grid}
			</div>
		);
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

						if (j >= 4 && k >= 4 && group.table.length >= 6 &&
								group.matches.length !== group.table.length * (group.table.length - 1)) {
							index += 4;
						}

						if (j >= 4 && group.matches.length === group.table.length * (group.table.length - 1)) {
							index += 20;
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
