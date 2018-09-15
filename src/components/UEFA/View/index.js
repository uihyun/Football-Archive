import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, PageSelector, Year } from '../../Common';
import { clubs } from '../data';

import AllMatches from '../../AllMatches';
import Statistics from '../../Statistics';
import Standings from '../../Standings';

import UrlUtil from '../../../util/url';

export default class UEFAView extends Component {

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
		const basename = '/UEFA/' + year + '/' + this.state.teamUrl;
		const views = this.getViews();

		if (this.state.team === '')
			return null;

		return (
			<div>
				<div className="UEFAView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="UEFAView-view-selector">
									◁ <Year year={prevYear} />
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<Link to={'/UEFA/' + year}>
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 UEFAView-view-selector text-right UEFAView-year">
										{year - 1}
	                </div>
	              	<div><Team team={this.state.team} emblemLarge={true}/></div>
              	  <div className="flex-1 UEFAView-view-selector text-left UEFAView-year">
										{year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
					</div>
					<div className="flex-1">
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="UEFAView-view-selector">
									<Year year={nextYear} /> ▷
								</div>
							</Link> :
							<Link to={'/history/team/' + UrlUtil.getTeamUrl(this.state.team)}>
								<div className="UEFAView-view-selector">
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

	fetchSeason(year, teamUrl) {
		const that = this;
		const url = UrlUtil.getSeasonSelectUrl(year, teamUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			const team = data.team;

			if (data.season) {
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
			showForm: (year === clubs.years.max + '')
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
