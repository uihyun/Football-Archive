import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Year } from '../../Common';

import CupView from '../Cup';
import LeagueView from '../League';

import { competitions } from '../data';

import UrlUtil from '../../../util/url';

export default class CompetitionView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			year: this.props.match.params.year,
			compUrl: this.props.match.params.comp,
			name: '',
			data: {},
		};
	}

	componentDidMount() {
		this.fetchSeason(this.state.year, this.state.compUrl);
	}

	componentWillReceiveProps(nextProps) {
		const year = nextProps.match.params.year;
		const compUrl = nextProps.match.params.comp;

		if (this.state.year !== year || this.state.comUrl !== compUrl) {
			this.setState({ year: year, teamUrl: compUrl });
			this.fetchSeason(year, compUrl);
		}
	}

	render() {
		if (this.state.name === '')
			return null;
		
		const comp = competitions[this.state.name];
		var prevYear = this.state.year - 1;
		var prevYearLink = UrlUtil.getCompLink(prevYear, this.state.name);
		var nextYear = prevYear + 2;
		var nextYearLink = UrlUtil.getCompLink(nextYear, this.state.name);

		return (
			<div className="CompetitionView">
				<div className="show-mobile">
					<div style={{fontSize: '1.5em'}} className="text-center">
						{this.state.name + ' '} 
					</div>
				</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="CompetitionView-view-selector">
									◁ <Year year={prevYear} fullyear={comp.times !== undefined} />
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<div style={{fontSize: '1.5em'}} className="text-center CompetitionView-view-selector">
							<span className="hide-mobile">
								{this.state.name + ' '} 
							</span>
							<Year year={this.state.year} fullyear={comp.times !== undefined} />
						</div>
					</div>
					<div className="flex-1">
						{nextYearLink &&
							<Link to={nextYearLink}>
								<div className="CompetitionView-view-selector">
									<Year year={nextYear} fullyear={comp.times !== undefined} /> ▷
								</div>
							</Link>
						}
					</div>
				</div>
				<br/>
				{this.state.data.league &&
					<LeagueView league={this.state.data.league} />}
				{this.state.data.cup &&
					<CupView cup={this.state.data.cup} />}
			</div>
		);
	}

	fetchSeason(year, compUrl) {
		const that = this;
		const url = UrlUtil.getCompetitionSelectUrl(year, compUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			if (data.name) {
				var state = {
					name: data.name,
					data: data,
				};

				that.setState(state);
			}
		});
	}
}
