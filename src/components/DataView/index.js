import React, { Component } from 'react';

import './style.css';

import TeamSelector from '../TeamSelector';
import EmblemLarge from '../EmblemLarge';

import Timeline from '../Views/Timeline';
import Summary from '../Views/Summary';
import Statistics from '../Views/Statistics';
import LeagueTable from '../Views/LeagueTable';

import UrlUtil from '../../util/url';
import SquadUtil from '../../util/squad';
		
const views = [
	{name: 'Timeline', mobile: 'TL', order: -1},
	{name: 'Summary', mobile: 'Sum', order: -2},
	{name: 'Statistics', mobile: 'Stat', order: 1},
	{name: 'Table', mobile: 'Tbl', order: 2},
];

export default class DataView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			season: {year: 2018, team: 'Manchester United'},
			view: 'Timeline',
			data: {competition: []},
			squad: []
		};

		this.selectView = this.selectView.bind(this);
	}

	componentDidMount() {
		this.fetchSeason(this.state.season);
	}

	render() {
		const season = this.state.season;
		return (
			<div>
				<TeamSelector season={season} onSelect={(s) => this.handleSeasonSelection(s)} />
				<div className="text-center flex-container">
					{views.map(view => {
						var style = { order: view.order };

						if (view.name === this.state.view) {
							style.fontWeight = 'bold';
						}

						return (
							<div key={view.name} style={style} className="DataView-view-selector flex-1"
									 onClick={() => this.selectView(view.name)}>
								<span className="hide-mobile">{view.name}</span>
								<span className="show-mobile">{view.mobile}</span>
							</div>
						);
					})}
					<div className="flex-2">
						<b>{season.year - 1 + ' '}
						<div className="DataView-team-logo"><EmblemLarge team={season.team} /></div>
						{' ' + season.year}</b>
					</div>
				</div>
				{this.getView()}
			</div>
		);
	}

	handleSeasonSelection(season) {
		this.fetchSeason(season);
	}

	fetchSeason(season) {
		const team = season.team;
		const that = this;
		const url = UrlUtil.getSeasonSelectUrl(season.year, team);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			const squad = SquadUtil.getSquadArray(data, team);

			if (data.season) {
				that.setState({
					season: season,
					data: data,
					squad: squad
				});
			}
		});
	}

	selectView(view) {
		this.setState({view: view});
	}

	getView() {
		if (this.state.view === 'Timeline') {
			return (<Timeline data={this.state.data} squad={this.state.squad} team={this.state.season.team}/>);
		} else if (this.state.view === 'Summary') {
			return (<Summary data={this.state.data} squad={this.state.squad} team={this.state.season.team}/>);
		} else if (this.state.view === 'Statistics') {
			return (<Statistics data={this.state.data} team={this.state.season.team} />);
		} else if (this.state.view === 'Table') {
			return (<LeagueTable data={this.state.data} />);
		}

		return (<div>{this.state.view} View under development</div>);
	}
}
