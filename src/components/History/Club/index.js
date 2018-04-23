import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import UrlUtil from '../../../util/url';

import {competitions} from '../data';

export default class Club extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			teamUrl: this.props.match.params.team,
			team: '',
			headers: [],
			seasons: [],
		};
	}

	componentDidMount() {
		this.fetch(this.state.teamUrl);
	}

	render() {
		return (
			<div className="ClubHistory text-center">
				<div fontSize="1.5em">{this.state.team}</div>
				<div className="flex-container text-center Versus-header">
					<div className="flex-1">Season</div>
					{this.state.headers.map(competition => {
						return (
							<div key={competition.name} className="flex-1">
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
										{this.getLeagueView(competition)}
										{this.getCupView(competition)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}

	getTrophy() {
		return '🏆';
	}

	getLeagueView(competition) {
		if (competition === null || competition.league === undefined)
			return null;

		const rank = competition.league.rank;

		return rank === 1 ? this.getTrophy() : rank;
	}

	getCupView(competition) {
		if (competition === null || competition.cup === undefined)
			return null;

		if (competition.cup.winner === this.state.team)
			return this.getTrophy();
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

		const span = (
			<span>
				<span className="hide-mobile">{a}-{b}</span>
				<span className="show-mobile">{this.formatShortYear(a)}{this.formatShortYear(b)}</span>
			</span>
		);


		const link = UrlUtil.getLink(year, this.state.team);

		if (link === null)
			return span;

		return (
			<Link to={link}>
				{span}
			</Link>
		);
	}

	fetch(teamUrl) {
		const that = this;
		const url = UrlUtil.getClubHistoryUrl(teamUrl);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			if (data.data) {
				that.setState(that.groupSeasons(data.data, data.team));
			}
		});
	}

	groupSeasons(data, team) {
		var seasonMap = {};
		var compMap = {};
		var i, j;
		var season, row;
		var seasonMin = 3000;
		var seasonMax = 1000;
		var headers = [];

		for (i = 0; i < data.length; i++) {
			row = data[i];
			if (row === null)
				continue;

			compMap[row.name] = true;
			seasonMin = Math.min(seasonMin, row.season);
			seasonMax = Math.max(seasonMax, row.season);
		}

		var competitionCount = 0;
		for (i in competitions) {
			if (compMap[i]) {
				compMap[i] = competitionCount++;
				headers.push(competitions[i]);
			}
		}

		for (i = seasonMin; i <= seasonMax; i++) {
			seasonMap[i] = {year: i, competitions: []};

			for (j = 0; j < competitionCount; j++) {
				seasonMap[i].competitions[j] = null;
			}
		}

		for (i = 0; i < data.length; i++) {
			row = data[i];
			if (row === null)
				continue;

			season = seasonMap[row.season];
			season.competitions[compMap[row.name]] = row;
		}

		var seasons = [];
		for (i in seasonMap) {
			if (seasonMap[i]) {
				seasons.push(seasonMap[i]);
			}
		}

		seasons.sort(function (a, b) {return b.year - a.year;});

		return { team: team, headers: headers, seasons: seasons };
	}
}
