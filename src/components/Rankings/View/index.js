import React, { Component } from 'react';

import './style.css';

import { ViewSelector, Ranking, YearSelector } from '../../Common';

import { clubs } from '../data';

export default class RankingsView extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			year: this.props.match.params.year,
			goals: []
		};
	}
	
	componentDidMount() {
		this.fetch(this.state.year);
	}

	componentWillReceiveProps(nextProps) {
		const year = nextProps.match.params.year;

		if (this.state.year !== year) {
			this.setState({ year: year });
			this.fetch(year);
		}
	}
	
	render() {
		var views = [];
		var groups = this.group(this.state.goals);
		const header = ['FIFA', 'UEFA', 'AFC'];

		header.forEach(code => {
			if (groups[code].length > 0) {
				views.push({name: code, view: (
					<div>
						<h3 className="hide-mobile text-center">{code}</h3>
						<Ranking goals={groups[code]} />
					</div>
				)});
			}
		});

		return (
			<div className="RankingView">
				<YearSelector year={this.state.year} min={clubs.years.min} max={clubs.years.max} link={'rankings'} />
				<ViewSelector views={views} expand={true}/>
			</div>
		);
	}

	group(goals) {
		const competitions = {
			'World Cup': 'FIFA',
			'Premier League': 'UEFA',
			'Primera División': 'UEFA',
			'Bundesliga': 'UEFA',
			'Serie A': 'UEFA',
			'Ligue 1': 'UEFA',
			'K League 1': 'AFC',
			'K League 2': 'AFC',
			'J1 League': 'AFC',
			'Super League': 'AFC',
		};

		const groups = {
			'FIFA': [],
			'UEFA': [],
			'AFC': [],
		};

		goals.forEach(comp => {
			var code = competitions[comp.name];
			groups[code] = groups[code].concat(comp.goals);
		});

		return groups;
	}
	
	fetch(year) {
		const that = this;
		const url = '/api/goal/select/' + year;

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			that.setState({goals: data});
		});
	}
}
