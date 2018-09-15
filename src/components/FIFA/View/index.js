import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, PageSelector } from '../../Common';

import AllMatches from '../../AllMatches';
import Statistics from '../../Statistics';
import Standings from '../../Standings';

import { nations, koreans } from '../data';

import UrlUtil from '../../../util/url';

export default class NationView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			year: this.props.match.params.year,
			teamUrl: this.props.match.params.team,
			team: '',
			data: {competitions: []},
		};
	}

	componentDidMount() {
		this.fetchSeason(this.state.year, this.state.teamUrl);
	}

	componentDidUpdate(prevProps) {
		const prevParams = prevProps.match.params;
		const params = this.props.match.params;

		if (params.year !== prevParams.year || params.team !== prevParams.team) {
			this.setState({ year: params.year, team: params.team, team: '' });
			this.fetchSeason(params.year, params.team);
		}
	}

	render() {
		var prevYear = this.state.year - 1;
		var prevYearLink = UrlUtil.getLink(prevYear, this.state.team);
		var nextYear = prevYear + 2;
		var nextYearLink = UrlUtil.getLink(nextYear, this.state.team);
		const year = this.state.year;
		const basename = '/FIFA/' + year + '/' + this.state.teamUrl;
		const views = this.getViews();

		if (this.state.team === '')
			return null;

		return (
			<div>
				<div className="FIFAView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="FIFAView-view-selector">
									◁ {prevYear}
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<Link to="/FIFA">
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 FIFAView-view-selector text-right FIFAView-year">
										{this.state.yearMin}
	                </div>
	              	<div><Team team={this.state.team} emblemLarge={true}/></div>
              	  <div className="flex-1 FIFAView-view-selector text-left FIFAView-year">
										{year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
					</div>
					<div className="flex-1">
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="FIFAView-view-selector">
									{nextYear} ▷
								</div>
							</Link> :
							<Link to={'/history/team/' + UrlUtil.getTeamUrl(this.state.team)}>
								<div className="FIFAView-view-selector">
									History
								</div>
							</Link>
						}
					</div>
				</div>
				{views.length > 0 &&
					<PageSelector views={views} basename={basename} />
				}
			</div>
		);
	}

	normalizeKoreanNames(data) {
		const team = data.team;
		const replaceMap = koreans.map;
		var i, comp;
		var j, match, summary, side, players, length;
		var k, player, goal;

		for (i = 0; i < data.competitions.length; i++) {
			comp = data.competitions[i];

			for (j = 0; j < comp.matches.length; j++) {
				match = comp.matches[j];

				if (match.summary === undefined)
					continue;

				summary = match.summary;
				if (summary.players === undefined)
					continue;

				side = (summary.r === team) ? 'r' : 'l';
				players = summary.players[side];

				for (k = 0; k < players.start.length; k++) {
					player = players.start[k];

					if (replaceMap[player.name])
						player.name = replaceMap[player.name];
				}

				length = players.sub ? players.sub.length : 0;
				for (k = 0; k < length; k++) {
					player = players.sub[k];

					if (replaceMap[player.name])
						player.name = replaceMap[player.name];
				}

				for (k = 0; k < summary.goals.length; k++) {
					goal = summary.goals[k];

					if (replaceMap[goal.scorer])
						goal.scorer = replaceMap[goal.scorer];

					if (replaceMap[goal.assist])
						goal.assist = replaceMap[goal.assist];	
				}
			}
		}

	}

	fetchSeason(year, teamUrl) {
		const that = this;
		var url;
		var i;
		var promise;
		var promises = [];
		var yearMin = Math.max(year - 3, nations.years.min);

		for (i = year; i >= yearMin; i--) {
			url = UrlUtil.getSeasonSelectUrl(i, teamUrl);
			promise = fetch(url).then(function(response) { return response.json(); });
			promises.push(promise);
		}

		Promise.all(promises)
		.then(function(dataArray) {
			if (dataArray[0].season === undefined)
				return;

			const team = dataArray[0].team;

			var i, data;
			var j, competition;
			var k, match;
			var result = {}
			var compMap = {};
			var cups = [];
			var url;
			var qualMap = {};
			var quals = [];
			var qual;

			for (i = 0; i < dataArray.length; i++) {
				data = dataArray[i];

				if (data.competitions === null)
					continue;

				for (j = 0; j < data.competitions.length; j++) {
					competition = data.competitions[j];
					url = competition.url;

					if (competition.name === 'Friendlies') {
						url = 'Friendlies';
					}

					if (compMap[url] === undefined) {
						compMap[url] = {name: competition.name, url: url, matches: []};
					}

					compMap[url].matches = compMap[url].matches.concat(competition.matches);

					for (k = 0; k < competition.matches.length; k++) {
						match = competition.matches[k];
						match.season = data.season;
					}
				}

				cups = cups.concat(data.cups);

				for (j = 0; j < data.quals.length; j++) {
					qual = data.quals[j];

					if (qualMap[qual.url] === undefined) {
						qualMap[qual.url] = true;
						quals.push(qual);
					}
				}
			}

			var compArray = [];
			for (i in compMap) {
				if (compMap[i]) {
					compArray.push(compMap[i]);
				}
			}

			result = {season: year, team: team, competitions: compArray, leagues: [], cups: cups, quals: quals};

			if (team === 'South Korea')
				that.normalizeKoreanNames(result);

			var state = {
				yearMin: yearMin,
				team: team,
				data: result,
			};

			that.setState(state);
		});
	}

	getViews() {
		const year = this.state.year;
		const data = {
			data: this.state.data,
			team: this.state.team,
			year: year,
			showForm: (year === nations.years.max + ''),
			showSummaryYear: true
		};

		var views = [];
		if (this.state.data.competitions.length === 0)
			return views;

		views.push({
			name: 'All Matches',
			link: '/matches',
			component: AllMatches,
			data: data
		});
		views.push({
			name: 'Statistics',
			link: '/statistics',
			component: Statistics,
			data: data
		});
		views.push({
			name: 'Standings',
			link: '/standings',
			component: Standings,
			data: data
		});

		return views;
	}
}
