import React, { Component } from 'react';

import './style.css';

import { LeagueTable, Year } from '../../Common';
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
				<div style={{fontSize: '1.5em'}} className="text-center">
					{this.state.name + ' '} 
					<Year year={this.state.year} />
				</div>
				<br/>
				{this.state.data.league &&
					<LeagueTable league={this.state.data.league} hideName={true} />}
				{this.state.data.cup &&
					<Cup cup={this.state.data.cup} hideName={true} />}
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
