import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, Scoreboard } from '../Common';

import { colors } from '../data';

import UrlUtil from '../../util/url';
import Match from '../../util/match';

export default class RecentMatches extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {width: 0, height: 0};
		
		this.updateDimensions = this.updateDimensions.bind(this);
	}

	updateDimensions() {
		this.setState({width: window.innerWidth, height: window.innerHeight});
	}

	componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount() {
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.updateDimensions);
	}

	render() {
		const competitions = this.props.data.competitions;

		if (competitions.length === 0)
			return null;

		return (
			<div className="Recent">
				{competitions.map(comp => {
					if (comp.matches.length === 0)
						return null;

					var logo = null;
					if (comp.country)
						logo = <Team team={comp.country} emblemSmall={true} />

					var nameDiv = <div className="Recent-comp text-center">{logo} {comp.name}</div>;

					const link = UrlUtil.getCompLink(comp.season, comp.name);
					if (link !== null)
						nameDiv = <Link to={link}>{nameDiv}</Link>;

					var year = comp.season;
					if (comp.seasonMax)
						year = comp.seasonMax;

					return (
						<div key={comp.name}>
							{nameDiv}
							{this.getGrid(comp.matches, year)}
						</div>
					);
				})}
			</div>
		);
	}

	groupMatches(matches) {
		var group = [];
		var i, match;

		for (i = 0; i < matches.length; i++) {
			match = matches[i];
			group.push({
				teams: match.teams,
				matches: [match]
			});
		}

		return group;
	}

	getGrid(matches, year) {
		var outerGridStyle = { 
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 1fr 1fr',
			gridColumnGap: '5px',
			justifyItems: 'center',
		};
		var innerGridStyle = {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr 14px 1fr 1fr',
			height: '21px',
			justifyItems: 'center',
		};

		if (this.state.width > 543) {
			innerGridStyle.gridTemplateColumns = '1fr 1fr 40px 1fr 1fr';
			innerGridStyle.height = '50px';
			innerGridStyle.lineHeight = '50px';
			innerGridStyle.alignItems = 'center';
		}

		return (
			<div style={outerGridStyle}>
				{matches.map((match, index) => {
					const [result, colorResult] = this.getMatchResult(match);
					const style = Object.assign({}, innerGridStyle);
					if (result !== 'unplayed') {
						style.background = colors[Match.getColorDNP(colorResult)];
					}

					return (
					<div key={index} style={style}>
						{this.getRank(match.teams[0])}
						{this.getTeam(match.teams[0], year)}
						{this.getResult(match, result, colorResult)}
						{this.getTeam(match.teams[1], year)}
						{this.getRank(match.teams[1])}
					</div>
					);
				})}
			</div>
		);
	}

	getMatchResult(match) {
		const ranks = this.props.data.teamRanks;
		const teamA = match.teams[0];
		const teamB = match.teams[1];

		const sum = Match.summarizeResult(match, teamA);
		const result = sum.result;
		var colorResult = result;

		if ((ranks[teamA] && ranks[teamB] && ranks[teamA] > ranks[teamB]) ||
				(ranks[teamA] === undefined && ranks[teamB])) {
			colorResult = Match.summarizeResult(match, teamB).result;
		}

		return [result, colorResult];
	}

	getTeam(team, year) {
		if (this.state.width <= 543) {
			return <Team team={team} emblemSmall={true} year={year}/>
		} else {
			return <Team team={team} emblemLarge={true} year={year}/>
		}
	}

	getRank(team) {
		var rank = this.props.data.teamRanks[team];
		var style = {color: 'gray'}

		if (rank >= 100 && this.state.width < 534)
			rank = <small><small>{rank}</small></small>;

		return <div style={style}><small>{rank}</small></div>;
	}

	getResult(match, result, colorResult) {
		const ranks = this.props.data.teamRanks;
		const teamA = match.teams[0];
		const teamB = match.teams[1];

		if (this.state.width > 543) {
			var team = teamA;

			if ((ranks[teamA] && ranks[teamB] && ranks[teamA] > ranks[teamB]) ||
					(ranks[teamA] === undefined && ranks[teamB])) {
				team = teamB;
			}

			return <Scoreboard team={team} match={match} reverse={team === teamB} />;
		}

		const color = colors[Match.getColor(colorResult)];
		const bgcolor = colors[Match.getColorDNP(colorResult)];
			
		var svgStyle = {width: '10px', height: '21px', background: bgcolor};
		var lineStyle = {stroke: color, strokeWidth: '3px', fill: 'none'};
		if (result === 'win') {
			return (
				<svg style={svgStyle}>
					<polyline points="0,3 9,10.5 0,18" style={lineStyle}/>
				</svg>
			);
		} else if (result === 'draw') {
			return (
				<svg style={svgStyle}>
					<line x1="0" x2="10" y1="8" y2="8" style={lineStyle}/>
					<line x1="0" x2="10" y1="13" y2="13" style={lineStyle}/>
				</svg>
			);
		} else if (result === 'loss') {
			return (
				<svg style={svgStyle}>
					<polyline points="10,3 1,10.5 10,18" style={lineStyle}/>
				</svg>
			);
		} else {
			svgStyle.background = 'none';
			return <div style={svgStyle} className="text-center"><small>v</small></div>;
		}
	}
}
