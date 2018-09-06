import React, { Component } from 'react';

import './style.css';

import { PageSelector } from '../Common';

import Matches from './matches';

import { competitions, nations, teams } from '../data';
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
		const teamRanks = this.state.teamRanks;

		views.push({ name: 'Recent', link: '/recent', component: Matches,
			data: {competitions: this.state.competitions, teamRanks: teamRanks} });
		views.push({ name: 'Yesterday', link: '/yesterday', component: Matches, 
			data: {competitions: this.filterByDay(-1), teamRanks: teamRanks} });
		views.push({ name: 'Today', link: '/today', component: Matches,
			data: {competitions: this.filterByDay(0), teamRanks: teamRanks} });

		return <PageSelector views={views} basename={'/home'} />;
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
				competitions.push({ name: comp.name, matches: matches, season: comp.season, country: comp.country });
		}

		return competitions;
	}

	fetch() {
		const that = this;
		const url = UrlUtil.getRecentMatchesUrl();

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			const matches = data.matches;
			var teamRanks = data.teamRanks;
			var compMap = {};
			var comps = [];
			var i, j, match;
			var comp, prevMatch, compMatches;

			var teamMap = {};
			var team;
			for (i in teams) {
				if (teams[i]) {
					team = teams[i];
					if (team) {
						if (Number.isInteger(team.id))
							continue;

						if (team.fifa)
							teamMap[team.fifa] = i;
						else
							teamMap[team.id] = i;
					}
				}
			}

			data.fifaRanking.ranks.forEach(entry => {
				teamRanks[teamMap[entry.id]] = entry.rank;
			});

			j = 0;
			for (i in competitions) {
				if (i) {
					comps[j] = {name: competitions[i].name, matches: []};
					if (competitions[i].country)
						comps[j].country = competitions[i].country;
					compMap[i] = j++;
				}
			}
			
			matches.forEach(match => {
				match.dateO = new Date(match.date);
				j = compMap[match.competition];
				comps[j].matches.push(match);
				comps[j].season = match.season;
				match.ranks = [teamRanks[match.teams[0]], teamRanks[match.teams[1]]].filter(a => a);
				match.rankSum = 0;
				if (match.ranks.length > 0)
					match.rankSum = match.ranks.reduce((total, num) => total + num);
			});
			
			for (i in competitions) {
				if (i) {
					comps[compMap[i]].seasonMax = nations.years.max;
					if(i === 'Friendlies')
						break;
				}
			}

			for (i = 0; i < comps.length; i++) {
				comp = comps[i];

				comp.matches.sort((a, b) => {
					if (a.ranks.length === b.ranks.length) {
						if (a.ranks.length > 0) {
							if (a.rankSum !== b.rankSum)
								return a.rankSum - b.rankSum;
							else
								return Math.min(...a.ranks) - Math.min(...b.ranks);
						}
					} else {
						return b.ranks.length - a.ranks.length;
					}

					if (a.dateO.toString() === b.dateO.toString()) {

						if ((a.summary && b.summary) || !(a.summary || b.summary)) {
							return a.teams[0] < b.teams[0] ? -1 : 1;
						} else {
							return a.summary ? -1 : 1;
						}
					}

					return a.dateO < b.dateO ? -1 : 1;
				});

				// remove duplicates (can only occur when there is no match url)
				if (comp.matches.length > 0) {
					compMatches = [comp.matches[0]];
					for (j = 1; j < comp.matches.length; j++) {
						prevMatch = comp.matches[j - 1];
						match = comp.matches[j];

						if (match.dateO.toString() !== prevMatch.dateO.toString() ||
							match.teams[0] !== prevMatch.teams[0] ||
							match.teams[1] !== prevMatch.teams[1]) {
							compMatches.push(match);
						}
					}

					comp.matches = compMatches;
				}
			}

			that.setState({competitions: comps, teamRanks: teamRanks});
		});
	}
}
