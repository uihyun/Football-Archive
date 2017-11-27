import React, { Component } from 'react';

import './style.css';

import Scoreboard from '../../Scoreboard';
import EmblemLarge from '../../EmblemLarge';

import UrlUtil from '../../../util/url';

import competitions from '../../../data/competitions';

export default class Versus extends Component {
	
	constructor(props) {
		super(props);


		this.state = {header: [], seasons: []};
	}

	componentDidMount() {
		this.fetch();
	}

	render() {
		return (
			<div>
				<div className="text-center">
					<EmblemLarge team={this.props.teamA} />
					<EmblemLarge team={this.props.teamB} />
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
		return (
			<span>
				<span className="hide-mobile">{a}-{b}</span>
				<span className="show-mobile">{this.formatShortYear(a)}-{this.formatShortYear(b)}</span>
			</span>
		);
	}

	getScoreboard(match) {
		if (match === undefined) {
			return (<Scoreboard isEmpty={true} shrinkOnMobile={true}/>);
		}

		return (
			<div onClick={() => this.props.selectMatch(match)}>
				<Scoreboard team={this.props.teamA} match={match} 
				 shrinkOnMobile={true} />
			</div>
		);
	}

	fetch() {
		const that = this;
		const url = UrlUtil.getVersusSelectUrl(this.props.teamA, this.props.teamB);
		
		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			that.setState(that.groupMatches(data));
		});
	}

	groupMatches(matches) {
		var seasonMap = {};
		var comps = [];
		var i, match, compName, comp;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			compName = match.competition;
			comp = competitions[compName];
			comps[comp.order] = comp;
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

		var j, compIndex, matchIndex;
		for (i = 0; i < matches.length; i++) {
			match = matches[i];

			if (seasonMap[match.season] === undefined) {
				seasonMap[match.season] = {year: match.season, competitions: []};

				for (j = 0; j < competitionCount; j++) {
					seasonMap[match.season].competitions[j] = [];
				}
			}

			comp = competitions[match.competition];
			compIndex = comps[comp.order];

			matchIndex = (match.summary.l === this.props.teamA) ? 0 : 1;
			seasonMap[match.season].competitions[compIndex][matchIndex] = match;
		}

		var seasons = [];
		for (i in seasonMap) {
			if (seasonMap[i]) {
				seasons.push(seasonMap[i]);
			}
		}

		seasons.sort(function (a, b) {return a.year - b.year;});

		return {header: header, seasons: seasons};
	}
}
