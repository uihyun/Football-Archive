import React, { Component } from 'react';

import './style.css';

import { PageSelector, YearSelector } from '../../Common';

import Rankings from './rankings';

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
			this.setState({ year: year, goals: [] });
			this.fetch(year);
		}
	}
	
	render() {
		var views = [];
		var groups = this.group(this.state.goals);
		const header = ['FIFA', 'UEFA', 'AFC'];
		const year = this.state.year;

		header.forEach(code => {
			if (groups[code].length > 0) {
				views.push({name: code, link: '/' + code, component: Rankings,
					data: { code: code, goals: groups[code], year: year } });
			}
		});

		const basename = '/rankings/' + year;

		return (
			<div className="RankingView">
				<div className="RankingView-header text-center">Top Scorers</div>
				<YearSelector year={year} min={clubs.years.min} max={clubs.years.max} link={'rankings'} />
				{views.length > 0 &&
					<PageSelector views={views} expand={true} basename={basename} />
				}
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
