import React, { Component } from 'react';

import './style.css';

import EmblemLarge from '../EmblemLarge';

import Timeline from '../Views/Timeline';
import Summary from '../Views/Summary';
import Statistics from '../Views/Statistics';
import LeagueTable from '../Views/LeagueTable';
import TeamSelector from '../Views/TeamSelector';
import MatchDetails from '../Views/MatchDetails';
import Versus from '../Views/Versus';

import UrlUtil from '../../util/url';
import SquadUtil from '../../util/squad';
		
const views = [
	{name: 'Timeline', mobile: 'TL', order: -1},
	{name: 'Summary', mobile: 'Sum', order: -2},
	{name: 'Statistics', mobile: 'Stat', order: 1},
	{name: 'League Table', mobile: 'Tbl', order: 2},
];

export default class DataView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			season: {country: 'ENG', year: 2018, team: 'Manchester United'},
			view: 'Timeline',
			prevView: [],
			data: {competition: []},
			squad: [],
			match: null
		};

		this.selectView = this.selectView.bind(this);
		this.handleMatchSelection = this.handleMatchSelection.bind(this);
		this.showVersus = this.showVersus.bind(this);
	}

	componentDidMount() {
		this.fetchSeason(this.state.season);
	}

	render() {
		const season = this.state.season;
		return (
			<div>
				<TeamSelector season={this.state.season} onSelect={(s) => this.handleSeasonSelection(s)} />
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
					<div className="flex-2" onClick={() => this.selectView('Team Selector')}>
						<b>{season.year - 1 + ' '}
						<div className="DataView-team-logo"><EmblemLarge team={season.team} /></div>
						{' ' + season.year}</b>
					</div>
				</div>
				{this.getView()}
			</div>
		);
	}

	showVersus() {
		this.selectView('Versus');
	}

	handleMatchSelection(match) {
		this.setState({match: match});
		this.selectView('Match');
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
				var state = {
					season: season,
					data: data,
					squad: squad,
					match: null
				};

				if (that.state.view === 'Team Selector' ||
						that.state.view === 'Match' ||
						that.state.view === 'Versus') {
					if (that.state.prevView.length === 0) {
						state.view = 'Timeline'; // default fallback
					} else {
						var prevView = that.state.prevView;
						state.view = prevView.pop();
						state.prevView = prevView;
					}
				}

				that.setState(state);
			}
		});
	}

	selectView(view) {
		if (view !== this.state.view) {
			if (this.state.view !== 'Team Selector' &&
					this.state.view !== 'Match' &&
					this.state.view !== 'Versus') {
				const prevView = this.state.prevView.concat([this.state.view]);
				this.setState({view: view, prevView: prevView});
			} else {
				this.setState({view: view});
			}
		}
	}

	getView() {
		if (this.state.view === 'Match') {
			return (<MatchDetails match={this.state.match} team={this.state.season.team} showVersus={this.showVersus}/>);
		} else if (this.state.view === 'Timeline') {
			return (<Timeline data={this.state.data} squad={this.state.squad} team={this.state.season.team}
					              selectMatch={this.handleMatchSelection}/>);
		} else if (this.state.view === 'Summary') {
			return (<Summary data={this.state.data} squad={this.state.squad} team={this.state.season.team}
					             selectMatch={this.handleMatchSelection}/>);
		} else if (this.state.view === 'Statistics') {
			return (<Statistics data={this.state.data} team={this.state.season.team} />);
		} else if (this.state.view === 'League Table') {
			return (<LeagueTable data={this.state.data} team={this.state.season.team}/>);
		} else if (this.state.view === 'Team Selector') {
			return (<TeamSelector season={this.state.season} onSelect={(s) => this.handleSeasonSelection(s)} showYears={true} />);
		} else if (this.state.view === 'Versus') {
			var teamB;
			if (this.state.match.vs) {
				teamB = this.state.match.vs;
			} else {
				if (this.state.match.summary.l === this.state.season.team) {
					teamB = this.state.match.summary.r;
				} else {
					teamB = this.state.match.summary.l;
				}
			}

			return (<Versus teamA={this.state.season.team} teamB={teamB}
					            selectMatch={this.handleMatchSelection}/>);
		}

		return (<div>{this.state.view} View under development</div>);
	}
}
