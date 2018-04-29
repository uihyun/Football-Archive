import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Grid } from '../Common';

import {clubs, competitions} from '../data';
import UrlUtil from '../../util/url';

export default class Recent extends Component {
	
	constructor(props) {
		super(props);

		this.state = {competitions: []};
	}
	
	componentDidMount() {
		this.fetch();
	}

	render() {
		const year = clubs.years.max;

		return (
			<div className="Recent">
				{this.state.competitions.map(comp => {
					if (comp.matches.length === 0)
						return null;

					var matches = this.groupMatches(comp.matches);

					const link = UrlUtil.getCompLink(year, comp.name);
					var nameDiv = <div className="Recent-comp text-center">{comp.name}</div>;

					if (link !== null) {
						nameDiv = <Link to={link}>{nameDiv}</Link>;
					}

					return (
						<div key={comp.name}>
							{nameDiv}
							<Grid matches={matches} year={year} />
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

	fetch() {
		const that = this;
		const url = UrlUtil.getRecentMatchesUrl(clubs.years.max);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {

			var compMap = {};
			var comps = [];
			var i, j, match;

			j = 0;
			for (i in competitions) {
				if (i) {
					comps[j] = {name: competitions[i].name, matches: []};
					compMap[i] = j++;
				}
			}
			
			for (i = 0; i < data.length; i++) {
				match = data[i];
				match.dateO = new Date(match.date);
				j = compMap[match.competition];
				comps[j].matches.push(match);
			}
			
			for (i = 0; i < comps.length; i++) {
				comps[i].matches.sort((a, b) => {
					if (a.dateO.toString() === b.dateO.toString()) {
						if ((a.summary && b.summary) || !(a.summary || b.summary)) {
							return a.teams[0] < b.teams[0] ? -1 : 1;
						} else {
							return a.summary ? -1 : 1;
						}
					}

					return a.dateO < b.dateO ? -1 : 1;
				});
			}

			that.setState({competitions: comps});
		});
	}
}
