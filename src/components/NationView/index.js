import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {Team, ViewSelector} from '../Common';

import AllMatches from '../AllMatches';
import Statistics from '../Statistics';
import Standings from '../Standings';

import {nations} from '../data';

import UrlUtil from '../../util/url';

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

	componentWillReceiveProps(nextProps) {
		const year = nextProps.match.params.year;
		const teamUrl = nextProps.match.params.team;

		if (this.state.year !== year || this.state.teamUrl !== teamUrl) {
			this.setState({ year: year, teamUrl: teamUrl });
			this.fetchSeason(year, teamUrl);
		}
	}

	render() {
		var prevYear = this.state.year - 1;
		var prevYearLink = UrlUtil.getLink(prevYear, this.state.team);
		var nextYear = prevYear + 2;
		var nextYearLink = UrlUtil.getLink(nextYear, this.state.team);

		return (
			<div>
				<div className="ClubView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="ClubView-view-selector">
									◁ {prevYear}
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<Link to="/nation">
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 ClubView-view-selector text-right ClubView-year">
										{this.state.yearMin}
	                </div>
	              	<div><Team team={this.state.team} emblemLarge={true}/></div>
              	  <div className="flex-1 ClubView-view-selector text-left ClubView-year">
										{this.state.year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
					</div>
					<div className="flex-1">
						{nextYearLink &&
							<Link to={nextYearLink}>
								<div className="ClubView-view-selector">
									{nextYear} ▷
								</div>
							</Link>
						}
					</div>
				</div>
				<ViewSelector views={this.getViews()} />
			</div>
		);
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

			var i, data, j, competition;
			var result = {}
			var compMap = {};
			var cups = [];
			var url;

			for (i = 0; i < dataArray.length; i++) {
				data = dataArray[i];

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
				}

				cups = cups.concat(data.cups);
			}

			var compArray = [];
			for (i in compMap) {
				if (compMap[i]) {
					compArray.push(compMap[i]);
				}
			}

			result = {season: year, team: team, competitions: compArray, leagues: [], cups: cups};

			var state = {
				yearMin: yearMin,
				team: team,
				data: result,
			};

			that.setState(state);
		});
	}

	getViews() {
		const data = this.state.data;
		const team = this.state.team;
		const year = this.state.year;
		const showForm = (year === nations.years.max + '');

		var views = [];
		if (data.competitions.length === 0)
			return views;

		views.push({
			name: 'All Matches',
			view: (<AllMatches data={data} team={team} year={year} showForm={showForm}
							showSummaryYear={true} />)
		});
		views.push({
			name: 'Statistics',
			view: (<Statistics data={data} team={team} />)
		});
		views.push({
			name: 'Standings',
			view: (<Standings data={data} team={team} showYear={true}/>)
		});

		return views;
	}
}
