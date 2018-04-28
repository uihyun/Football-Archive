import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team } from '../../Common';

import UrlUtil from '../../../util/url';

import { competitions, rounds } from '../data';

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
		const teamNameStyle = { fontSize: '1.5em' };
		const seasonStyle = { lineHeight: '32px' };
		const rankStyle = { fontSize: '1.5em' };

		return (
			<div className="ClubHistory text-center">
				<div style={teamNameStyle}>{this.state.team}</div>
				<div><Team team={this.state.team} emblemLarge={true} /></div>
				<div className="flex-container text-center">
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
						<div key={season.year} className="flex-container" style={seasonStyle}>
							<div className="flex-1" style={seasonStyle} >{this.getSeasonSpan(season.year)}</div>
							{season.competitions.map((competition, index) => {

								var link = null;
								if (competition !== null)
									link = UrlUtil.getCompLink(competition.season, competition.name);

								var div = (
									<div key={index} className="flex-1" style={rankStyle}>
										{this.getLeagueView(competition, link)}
										{this.getCupView(competition, link)}
									</div>
								);

								return div;
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

	getLeagueView(competition, link) {
		if (competition === null || competition.league === undefined)
			return null;

		const rank = competition.league.rank;
		var text = rank === 1 ? this.getTrophy() : rank;

		if (link)
			text = <Link to={link}>{text}</Link>;

		return text;
	}

	getCupView(competition, link) {
		if (competition === null || competition.cup === undefined)
			return null;

		const cup = competition.cup;
		var result;

		var i, row;
		if (cup.table) {
			for (i = 0; i < cup.table.length; i++) {
				row = cup.table[i];

				if (row.name === this.state.team) {
					result = 'G' + row.rank;
		
					if (link)
						result = <Link to={link}>{result}</Link>;

					return result;
				}
			}
		}

		const vs = cup.matches[0].l === this.state.team ? cup.matches[0].r : cup.matches[0].l;
		const round = cup.round.replace(/\./, '');
		result = rounds.getShortForm(competition.name, round).replace(/F/, '2');

		if (cup.winner === this.state.team)
			result = this.getTrophy();

		if (link)
			result = <Link to={link}>{result}</Link>;

		return (
			<div className="flex-container">
				<div className="flex-2 hide-mobile" />
				<div className="flex-1">
					{result}
				</div>
				<div className="flex-1">
					<Team team={vs} year={competition.season} emblemSmall={true} />
				</div>
				<div className="flex-2 hide-mobile" />
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
