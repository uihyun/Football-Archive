import React, { Component } from 'react';

import './style.css';

import { LeagueTable } from '../../Common';
import { Cup } from '../../Graphics';

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
		return (
			<div className="CompetitionView">
				{this.state.data.league &&
					<LeagueTable league={this.state.data.league} />}
				{this.state.data.cup &&
					<Cup cup={this.state.data.cup} />}
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
