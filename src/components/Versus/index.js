import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import {Scoreboard, Team} from '../Common';

import UrlUtil from '../../util/url';

import {competitions} from '../data';

export default class Versus extends Component {
	
	constructor(props) {
		super(props);

		const teamAUrl = this.props.match.params.teamA;
		const teamBUrl = this.props.match.params.teamB;

		this.state = {header: [], seasons: [], teamAUrl: teamAUrl, teamBUrl: teamBUrl, teamA: '', teamB: ''};
	}

	componentDidMount() {
		this.fetch(this.state.teamAUrl, this.state.teamBUrl);
	}

  componentWillReceiveProps(nextProps) {
		const teamAUrl = nextProps.match.params.teamA;
		const teamBUrl = nextProps.match.params.teamB;

    if (this.state.teamAUrl !== teamAUrl || this.state.teamBUrl !== teamBUrl) {
      this.setState({header: [], seasons: [], teamAUrl: teamAUrl, teamBUrl: teamBUrl, teamA: '', teamB: ''});
			this.fetch(teamAUrl, teamBUrl);
    }
  }

	render() {
		return (
			<div>
				<div className="text-center">
					<Team team={this.state.teamA} emblemLarge={true}/>
					<Team team={this.state.teamB} emblemLarge={true}/>
				</div>
				<div className="flex-container text-center Versus-header">
					<div className="flex-1">Season</div>
					{this.state.header.map(competition => {
						return (
							<div key={competition.order} className="flex-1">
								<span className="hide-mobile">{competition.name}</span>
								<span className="show-mobile">{competition.sh}</span>
							</div>
						);
					})}
				</div>
				{this.state.seasons.map(season => {
					return (
						<div key={season.year} className="flex-container">
							<div className="flex-1 text-center">{this.getSeasonSpan(season.year)}</div>
							{season.competitions.map((competition, index) => {
								return (
									<div key={index} className="flex-1">
										<div className="flex-container">
											<div className="flex-1"></div>
												{this.getScoreboard(competition[0])}
												{this.getScoreboard(competition[1])}
											<div className="flex-1"></div>
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
				<div className="text-center">
					<Link to={'/versus/' + this.state.teamBUrl + '/' + this.state.teamAUrl}>
						swap left & right
					</Link>
				</div>
			</div>
		);
	}

	formatShortYear(year) {
		year %= 100;
		if (year === 0) {
			return '00';
		} else if (year < 10) {
			return '0' + year;
		}

		return year;
	}

	getSeasonSpan(year) {
		var a = year - 1;
		var b = year;

		if (this.state.teamAUrl.endsWith('-team') ||
				this.state.teamBUrl.endsWith('-team')) {
			return <span>{year}</span>;
		}

		return (
			<span>
				<span className="hide-mobile">{a}-{b}</span>
				<span className="show-mobile">{this.formatShortYear(a)}{this.formatShortYear(b)}</span>
			</span>
		);
	}

	getScoreboard(match) {
		if (match === undefined) {
			return (<Scoreboard isEmpty={true} shrinkOnMobile={true}/>);
		}

		return (
			<div>
				<Scoreboard team={this.state.teamA} match={match} 
				 shrinkOnMobile={true} />
			</div>
		);
	}

	fetch(teamAUrl, teamBUrl) {
		const that = this;
		const url = UrlUtil.getVersusSelectUrl(teamAUrl, teamBUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			that.setState(that.groupMatches(data));
		});
	}

	groupMatches(data) {
		var matches = data.matches;
		var seasonMap = {};
		var comps = [];
		var i, j;
		var match, compName, comp;

		var seasonMin = matches[0].season;
		var seasonMax = seasonMin;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			compName = match.competition;
			comp = competitions[compName];
			comps[comp.order] = comp;

			seasonMin = Math.min(seasonMin, match.season);
			seasonMax = Math.max(seasonMax, match.season);
		}

		var competitionCount = 0;
		var header = [];
		for (i = 0; i < comps.length; i++) {
			if (comps[i]) {
				header[competitionCount] = comps[i];
				comps[i] = competitionCount;
				competitionCount++;
			}
		}

		for (i = seasonMin; i <= seasonMax; i++) {
			seasonMap[i] = {year: i, competitions: []};

			for (j = 0; j < competitionCount; j++) {
				seasonMap[i].competitions[j] = [];
			}
		}

		var compIndex, matchIndex;
		for (i = 0; i < matches.length; i++) {
			match = matches[i];

			comp = competitions[match.competition];
			compIndex = comps[comp.order];

			matchIndex = (match.summary.l === data.teamA) ? 0 : 1;
			seasonMap[match.season].competitions[compIndex][matchIndex] = match;
		}

		var seasons = [];
		for (i in seasonMap) {
			if (seasonMap[i]) {
				seasons.push(seasonMap[i]);
			}
		}

		seasons.sort(function (a, b) {return a.year - b.year;});

		return {header: header, seasons: seasons, teamA: data.teamA, teamB: data.teamB};
	}
}
