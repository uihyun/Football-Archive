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

		if (this.state.year !== year || this.state.compUrl !== compUrl) {
			this.setState({ year: year, compUrl: compUrl });
			this.fetchSeason(year, compUrl);
		}
	}

	render() {
		if (this.state.name === '')
			return null;
		
		const comp = competitions[this.state.name];
		var [prevYear, prevYearLink] = this.getPrevLink();
		var [nextYear, nextYearLink] = this.getNextLink();

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
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="CompetitionView-view-selector">
									<Year year={nextYear} fullyear={comp.times !== undefined} /> ▷
								</div>
							</Link> :
							<Link to={'/history/competition/' + UrlUtil.getCompUrl(this.state.name)}>
								<div className="ClubView-view-selector">
									History
								</div>
							</Link>
						}
					</div>
				</div>
				{this.state.data.league &&
					<LeagueView league={this.state.data.league} />}
				{this.state.data.cup &&
					<CupView cup={this.state.data.cup} />}
			</div>
		);
	}

	getPrevLink() {
		const comp = competitions[this.state.name];
		var year = parseInt(this.state.year, 10);
		var prevYear = year - 1;
		var curIndex;

		if (comp.times) {
			curIndex = comp.times.indexOf(year);

			if (curIndex > 0) {
				prevYear = comp.times[curIndex - 1];
			}
		}

		var link = UrlUtil.getCompLink(prevYear, this.state.name);
		return [prevYear, link];
	}

	getNextLink() {
		const comp = competitions[this.state.name];
		var year = parseInt(this.state.year, 10);
		var nextYear = year + 1;
		var curIndex;

		if (comp.times) {
			curIndex = comp.times.indexOf(year);

			if (curIndex < comp.times.length - 1) {
				nextYear = comp.times[curIndex + 1];
			}
		}

		var link = UrlUtil.getCompLink(nextYear, this.state.name);
		return [nextYear, link];
	}

	fetchSeason(year, compUrl) {
		const that = this;
		const url = UrlUtil.getCompetitionSelectUrl(year, compUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			var name = data.name;

			if (name) {
				var state = {
					name: name,
					data: data,
				};

				that.setState(state);
			}
		});
	}
}
