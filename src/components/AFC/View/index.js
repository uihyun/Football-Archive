import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, PageSelector, Year } from '../../Common';
import { afc } from '../data';

import AllMatches from '../../AllMatches';
import Statistics from '../../Statistics';
import Standings from '../../Standings';

import UrlUtil from '../../../util/url';

export default class AFCView extends Component {

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
			this.setState({ year: params.year, teamUrl: params.team, team: '' });
			this.fetchSeason(params.year, params.team);
		}
	}

	render() {
		var prevYear = this.state.year - 1;
		var prevYearLink = UrlUtil.getLink(prevYear, this.state.team);
		var nextYear = prevYear + 2;
		var nextYearLink = UrlUtil.getLink(nextYear, this.state.team);
		const year = this.state.year;
		const basename = '/AFC/' + year + '/' + this.state.teamUrl;
		const views = this.getViews();

		if (this.state.team === '')
			return null;

		return (
			<div>
				<div className="AFCView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="AFCView-view-selector">
									◁ <Year year={prevYear} fullyear={true}/>
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<Link to={'/AFC/' + year}>
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 AFCView-view-selector text-right AFCView-year"></div>
	              	<div><Team team={this.state.team} emblemLarge={true}/></div>
              	  <div className="flex-1 AFCView-view-selector text-left AFCView-year">
										{year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
					</div>
					<div className="flex-1">
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="AFCView-view-selector">
									<Year year={nextYear} fullyear={true}/> ▷
								</div>
							</Link> :
							<Link to={'/history/team/' + UrlUtil.getTeamUrl(this.state.team)}>
								<div className="AFCView-view-selector">
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

	normalizeACLNames(data, compMap) {
		const team = data.team;
		var league = compMap['K League 1'];
		var acl = compMap['AFC Champions League'];

		if (league === undefined)
			league = compMap['K League 2'];

		if (league === undefined || acl === undefined)
			return;

		var numberMap = {};
		var j, k, match, summary, side, players, player, length;

		for (j = 0; j < league.matches.length; j++) {
			match = league.matches[j];

			if (match.summary === undefined)
				continue;

			summary = match.summary;

			if (summary.players === undefined)
				continue;

			side = (summary.r === team) ? 'r' : 'l';
			players = summary.players[side];

			for (k = 0; k < players.start.length; k++) {
				player = players.start[k];
				numberMap[player.number] = player.name;
			}

			length = players.sub ? players.sub.length : 0;
			for (k = 0; k < length; k++) {
				player = players.sub[k];
				numberMap[player.number] = player.name;
			}	
		}

		var replaceMap, goal;
		
		for (j = 0; j < acl.matches.length; j++) {
			match = acl.matches[j];
			replaceMap = {};

			if (match.summary === undefined)
				continue;

			summary = match.summary;

			if (summary.players === undefined)
				continue;

			side = (summary.r === team) ? 'r' : 'l';
			players = summary.players[side];

			for (k = 0; k < players.start.length; k++) {
				player = players.start[k];

				if (numberMap[player.number]) {
					replaceMap[player.name] = numberMap[player.number];
					player.name = numberMap[player.number];
				}
			}

			length = players.sub ? players.sub.length : 0;
			for (k = 0; k < length; k++) {
				player = players.sub[k];

				if (numberMap[player.number]) {
					replaceMap[player.name] = numberMap[player.number];
					player.name = numberMap[player.number];
				}
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

	fetchSeason(year, teamUrl) {
		const that = this;
		const url = UrlUtil.getSeasonSelectUrl(year, teamUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			const team = data.team;

			function getCompetitionMap(data) {
				var map = {};
				
				data.competitions.forEach(comp => { map[comp.name] = comp; });

				return map;
			}

			if (data.season) {
				var compMap = getCompetitionMap(data);

				if (compMap['AFC Champions League'] &&
						(compMap['K League 1'] || compMap['K League 2'])) {
					that.normalizeACLNames(data, compMap);
				}

				var state = {
					team: team,
					data: data,
				};

				that.setState(state);
			}
		});
	}

	getViews() {
		const year = this.state.year;
		const data = {
			data: this.state.data,
			team: this.state.team,
			year: year,
			showForm: (year === afc.years.max + '')
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
