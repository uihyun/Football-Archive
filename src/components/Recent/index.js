import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Grid, ViewSelector } from '../Common';

import { clubs, competitions } from '../data';
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
		var views = [];

		views.push({ name: 'Recent', view: this.getView(this.state.competitions) });
		views.push({ name: 'Yesterday', view: this.getView(this.filterByDay(-1)) });
		views.push({ name: 'Today', view: this.getView(this.filterByDay(0)) });

		return <ViewSelector views={views} />;
	}

	getView(competitions) {
		const year = clubs.years.max;

		return (
			<div className="Recent">
				{competitions.map(comp => {
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

	filterByDay(offset) {
		var competitions = [];
		var matches;
		var i, comp;
		var j, match;
		var today = new Date();
		today.setDate(today.getDate() + offset);
		var day = today.toISOString().substring(0, 10).split('-');
		day.push(day.shift());
		day = day.join('/');

		for (i = 0; i < this.state.competitions.length; i++) {
			comp = this.state.competitions[i];
			matches = [];

			for (j = 0; j < comp.matches.length; j++) {
				match = comp.matches[j];

				if (match.date === day)
					matches.push(match);
			}

			if (matches.length > 0)
				competitions.push({ name: comp.name, matches: matches });
		}

		return competitions;
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
