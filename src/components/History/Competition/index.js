import React, { Component } from 'react';

import './style.css';

import CupHistory from '../Cup';
import LeagueHistory from '../League';

import UrlUtil from '../../../util/url';

export default class CompetitionView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			compUrl: this.props.match.params.comp,
			name: '',
			data: {},
		};
	}

	componentDidMount() {
		this.fetch(this.state.compUrl);
	}

	componentWillReceiveProps(nextProps) {
		const compUrl = nextProps.match.params.comp;

		if (this.state.compUrl !== compUrl) {
			this.setState({ compUrl: compUrl });
			this.fetchSeason(compUrl);
		}
	}

	render() {
		if (this.state.name === '')
			return null;
		
		return (
			<div className="CompetitionHistory text-center">
				<div style={{fontSize: '1.5em'}}>
					{this.state.name + ' '} 
				</div>
				{this.state.data.leagues &&
					<LeagueHistory name={this.state.data.name} seasons={this.state.data.leagues} />}
				{this.state.data.cups &&
					<CupHistory name={this.state.data.name} seasons={this.state.data.cups} />}
			</div>
		);
	}


	fetch(compUrl) {
		const that = this;
		const url = UrlUtil.getCompetitionHistoryUrl(compUrl);

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
