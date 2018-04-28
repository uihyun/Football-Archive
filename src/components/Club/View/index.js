import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, ViewSelector } from '../../Common';
import { clubs} from '../data';

import AllMatches from '../../AllMatches';
import Statistics from '../../Statistics';
import Standings from '../../Standings';

import UrlUtil from '../../../util/url';

export default class ClubView extends Component {

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
						<Link to={'/club/' + this.state.year}>
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 ClubView-view-selector text-right ClubView-year">
										{this.state.year - 1}
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
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="ClubView-view-selector">
									{nextYear} ▷
								</div>
							</Link> :
							<Link to={'/club/history/' + UrlUtil.getTeamUrl(this.state.team)}>
								<div className="ClubView-view-selector">
									History
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
		const data = this.state.data;
		const team = this.state.team;
		const year = this.state.year;
		const showForm = (year === clubs.years.max + '');

		var views = [];
		if (data.competitions.length === 0)
			return views;

		views.push({
			name: 'All Matches',
			view: (<AllMatches data={data} team={team} year={year} showForm={showForm} />)
		});
		views.push({
			name: 'Statistics',
			view: (<Statistics data={data} team={team} />)
		});
		views.push({
			name: 'Standings',
			view: (<Standings data={data} team={team} />)
		});

		return views;
	}
}
