import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {EmblemLarge} from '../Common';

import Timeline from '../Timeline';
import Summary from '../Summary';
import Statistics from '../Statistics';
import Standings from '../Standings';
import MatchDetails from '../MatchDetails';
import Versus from '../Versus';

import UrlUtil from '../../util/url';
import SquadUtil from '../../util/squad';
		
const views = [
	{name: 'Timeline', order: -2},
	{name: 'Summary', order: -1},
	{name: 'Statistics', order: 1},
	{name: 'Standings', order: 2},
];

export default class ClubView extends Component {

	constructor(props) {
		super(props);

		this.state = {
			year: this.props.match.params.year,
			teamUrl: this.props.match.params.team,
			view: 'Timeline',
			team: '',
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
		this.fetchSeason();
	}

	render() {
		return (
			<div>
				<div className="ClubView-team-name text-center">{this.state.team}</div>
				<div className="flex-container text-center">
					<div className="flex-2">
						<Link to={'/club/' + this.state.year}>
						  <b>
      	        <div className="flex-container flex-container-center">
    	            <div className="flex-1 ClubView-view-selector text-right ClubView-year">
										{this.state.year - 1}
	                </div>
	              	<div><EmblemLarge team={this.state.team} /></div>
              	  <div className="flex-1 ClubView-view-selector text-left ClubView-year">
										{this.state.year}
          	      </div>
        	      </div>
      	      </b>
						</Link>
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

	showVersus() {
		this.selectView('Versus');
	}

	handleMatchSelection(match) {
		this.setState({match: match});
		this.selectView('Match');
	}

	fetchSeason() {
		const that = this;
		const url = UrlUtil.getSeasonSelectUrl(this.state.year, this.state.teamUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			const team = data.team;
			const squad = SquadUtil.getSquadArray(data);

			if (data.season) {
				var state = {
					team: team,
					data: data,
					squad: squad,
					match: null
				};

				if (that.state.view === 'Match' ||
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
			if (this.state.view !== 'Match' &&
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
			return (<MatchDetails match={this.state.match} team={this.state.team} showVersus={this.showVersus}/>);
		} else if (this.state.view === 'Timeline') {
			return (<Timeline data={this.state.data} squad={this.state.squad} team={this.state.team}
					              selectMatch={this.handleMatchSelection}/>);
		} else if (this.state.view === 'Summary') {
			return (<Summary data={this.state.data} squad={this.state.squad} team={this.state.team}
					             selectMatch={this.handleMatchSelection}/>);
		} else if (this.state.view === 'Statistics') {
			return (<Statistics data={this.state.data} team={this.state.team} />);
		} else if (this.state.view === 'Standings') {
			return (<Standings data={this.state.data} team={this.state.team}/>);
		} else if (this.state.view === 'Versus') {
			var teamB;
			if (this.state.match.vs) {
				teamB = this.state.match.vs;
			} else {
				if (this.state.match.summary.l === this.state.team) {
					teamB = this.state.match.summary.r;
				} else {
					teamB = this.state.match.summary.l;
				}
			}

			return (<Versus teamA={this.state.team} teamB={teamB}
					            selectMatch={this.handleMatchSelection}/>);
		}

		return (<div>{this.state.view} View under development</div>);
	}
}
