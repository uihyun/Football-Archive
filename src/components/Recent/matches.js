import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Grid } from '../Common';

import UrlUtil from '../../util/url';

export default class RecentMatches extends Component {
	render() {
		const competitions = this.props.data;

		if (competitions.length === 0)
			return null;

		return (
			<div className="Recent">
				{competitions.map(comp => {
					if (comp.matches.length === 0)
						return null;

					var matches = this.groupMatches(comp.matches);

					const link = UrlUtil.getCompLink(comp.season, comp.name);
					var nameDiv = <div className="Recent-comp text-center">{comp.name}</div>;

					if (link !== null) {
						nameDiv = <Link to={link}>{nameDiv}</Link>;
					}

					return (
						<div key={comp.name}>
							{nameDiv}
							<Grid matches={matches} year={comp.season} />
						</div>
					);
				})}
			</div>
		);
	}

	groupMatches(matches) {
		var group = [];

		var i, match;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			group.push({
				teams: match.teams,
				matches: [match]
			});
		}

		return group;
	}
}
