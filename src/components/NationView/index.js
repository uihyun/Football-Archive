import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {Team} from '../Common';

import Timeline from '../Timeline';
import Summary from '../Summary';
import Statistics from '../Statistics';
//import Standings from '../Standings';

import {nations} from '../data';

import UrlUtil from '../../util/url';
import SquadUtil from '../../util/squad';
		
const views = [
	{name: 'Timeline', order: -2},
	{name: 'Summary', order: -1},
	{name: 'Statistics', order: 1},
	{name: 'Standings', order: 2},
];

export default class NationView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			year: this.props.match.params.year,
			teamUrl: this.props.match.params.team,
			view: 'Timeline',
			team: '',
			data: {competition: []},
			squad: [],
		};

		this.selectView = this.selectView.bind(this);
	}

	componentDidMount() {
		this.fetchSeason(this.state.year, this.state.teamUrl);
	}

	componentWillReceiveProps(nextProps) {
		const year = nextProps.match.params.year;
		const teamUrl = nextProps.match.params.team;

		if (this.state.year !== year || this.state.teamUrl !== teamUrl) {
			this.setState({ year: year, teamUrl: teamUrl });
			this.fetchSeason(year, teamUrl);
		}
	}

	render() {
		var prevYear = this.state.year - 1;
		var prevYearLink = UrlUtil.getLink(prevYear, this.state.team);
		var nextYear = prevYear + 2;
		var nextYearLink = UrlUtil.getLink(nextYear, this.state.team);

		return (
			<div>
				<div className="ClubView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-1">
						{prevYearLink &&
							<Link to={prevYearLink}>
								<div className="ClubView-view-selector">
									◁ {prevYear}
								</div>
							</Link>
						}
					</div>
					<div className="flex-2">
						<Link to="/nation">
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 ClubView-view-selector text-right ClubView-year">
										{this.state.yearMin}
	                </div>
	              	<div><Team team={this.state.team} emblemLarge={true}/></div>
              	  <div className="flex-1 ClubView-view-selector text-left ClubView-year">
										{this.state.year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
					</div>
					<div className="flex-1">
						{nextYearLink &&
							<Link to={nextYearLink}>
								<div className="ClubView-view-selector">
									{nextYear} ▷
								</div>
							</Link>
						}
					</div>
				</div>
				<div className="text-center flex-container">
					{views.map(view => {
						var style = { order: view.order };

						if (view.name === this.state.view) {
							style.fontWeight = 'bold';
						}

						return (
							<div key={view.name} style={style} className="flex-1"
									 onClick={() => this.selectView(view.name)}>
								{view.name}
							</div>
						);
					})}
				</div>
				{this.getView()}
			</div>
		);
	}

	fetchSeason(year, teamUrl) {
		const that = this;
		var url;
		var i;
		var promise;
		var promises = [];
		var yearMin = Math.max(year - 3, nations.years.min);

		for (i = year; i >= yearMin; i--) {
			url = UrlUtil.getSeasonSelectUrl(i, teamUrl);
			promise = fetch(url).then(function(response) { return response.json(); });
			promises.push(promise);
		}

		Promise.all(promises)
		.then(function(dataArray) {
			if (dataArray[0].season === undefined)
				return;

			const team = dataArray[0].team;

			var i, data, j, competition;
			var result = {}
			var compMap = {};

			for (i = 0; i < dataArray.length; i++) {
				data = dataArray[i];

				for (j = 0; j < data.competitions.length; j++) {
					competition = data.competitions[j];

					if (compMap[competition.name] === undefined) {
						compMap[competition.name] = {name: competition.name, matches: []};
					}

					compMap[competition.name].matches = compMap[competition.name].matches.concat(competition.matches);
				}
			}

			var compArray = [];
			for (i in compMap) {
				if (compMap[i]) {
					compArray.push(compMap[i]);
				}
			}

			result = {season: year, team: team, competitions: compArray, leagues: []};
			const squad = SquadUtil.getSquadArray(result);

			var state = {
				yearMin: yearMin,
				team: team,
				data: result,
				squad: squad,
			};

			that.setState(state);
		});
	}

	selectView(view) {
		if (view !== this.state.view) {
			this.setState({view: view});
		}
	}

	getView() {
		if (this.state.view === 'Timeline') {
			return (<Timeline data={this.state.data} squad={this.state.squad} team={this.state.team} year={this.state.year} />);
		} else if (this.state.view === 'Summary') {
			return (<Summary data={this.state.data} squad={this.state.squad} team={this.state.team} year={this.state.year} />);
		} else if (this.state.view === 'Statistics') {
			return (<Statistics data={this.state.data} team={this.state.team} />);
		}

		return (<div>{this.state.view} View under development</div>);
	}
}
