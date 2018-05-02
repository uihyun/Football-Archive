import React, { Component } from 'react';

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

	render() {
		if (this.state.name === '')
			return null;

		const comp = competitions[this.state.name];
		return (
			<div className="CompetitionView">
				<div style={{fontSize: '1.5em'}} className="text-center">
					{this.state.name + ' '} 
					<Year year={this.state.year} fullyear={comp.times !== undefined} />
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
