import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Year } from '../../Common';

import CupView from '../Cup';
import LeagueView from '../League';
import QualifierView from '../Qualifier';

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
			this.setState({ name: '', year: year, compUrl: compUrl });
			this.fetchSeason(year, compUrl);
		}
	}

	render() {
		if (this.state.name === '')
			return null;
		
		const comp = competitions[this.state.name];
		var [prevYear, prevYearLink] = this.getPrevLink();
		var [nextYear, nextYearLink] = this.getNextLink();
		const basename = '/competition/' + this.state.year + '/' + this.state.compUrl;

		return (
			<div className="CompetitionView">
				<div className="show-mobile">
					<div style={{fontSize: '1.5em'}} className="text-center">
						{competitions[this.state.name].name + ' '} 
					</div>
				</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="CompetitionView-view-selector">
									◁ {this.getYearView(prevYear, comp)}
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<div style={{fontSize: '1.5em'}} className="text-center CompetitionView-view-selector">
							<span className="hide-mobile">
								{competitions[this.state.name].name + ' '} 
							</span>
							{this.getYearView(this.state.year, comp)}
						</div>
					</div>
					<div className="flex-1">
						{nextYearLink ?
							<Link to={nextYearLink}>
								<div className="CompetitionView-view-selector">
									{this.getYearView(nextYear, comp)} ▷
								</div>
							</Link> :
							this.getHistoryLink()
						}
					</div>
				</div>
				{this.state.data.league &&
					<LeagueView league={this.state.data.league} goals={this.state.data.goals} basename={basename} />}
				{this.state.data.cup &&
					<CupView cup={this.state.data.cup} goals={this.state.data.goals} basename={basename} />}
				{this.state.data.qual &&
					<QualifierView qual={this.state.data.qual} basename={basename} />}
			</div>
		);
	}

	getYearView(year, comp) {
		const fullyear = comp.year === 'single';
		var span;

		if (comp.spans) {
			span = { times: comp.times, spans: comp.spans };
		}

		return <Year year={year} fullyear={fullyear} span={span} />;
	}

	getHistoryLink() {
		if (this.state.data.qual)
			return null;

		return (
			<Link to={'/history/competition/' + UrlUtil.getCompUrl(this.state.name)}>
				<div className="CompetitionView-view-selector">
					History
				</div>
			</Link>
		);
	}

	getPrevLink() {
		const comp = competitions[this.state.name];
		var year = parseInt(this.state.year, 10);
		var prevYear = year - 1;
		var curIndex;

		if (comp.times) {
			if (comp.spans) {
				curIndex = comp.spans.indexOf(year);
				
				if (curIndex > 0) {
					prevYear = comp.spans[curIndex - 1];
				} else {
					prevYear = 0;
				}
			} else {
				curIndex = comp.times.indexOf(year);

				if (curIndex > 0) {
					prevYear = comp.times[curIndex - 1];
				}
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
			if (comp.spans) {
				curIndex = comp.spans.indexOf(year);
				
				if (curIndex < comp.spans.length - 1) {
					nextYear = comp.spans[curIndex + 1];
				} else {
					nextYear = 0;
				}
			} else {
				curIndex = comp.times.indexOf(year);

				if (curIndex < comp.times.length - 1) {
					nextYear = comp.times[curIndex + 1];
				}
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
