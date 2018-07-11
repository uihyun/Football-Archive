import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Team, Year } from '../../Common';

import MatchUtil from '../../../util/match';
import UrlUtil from '../../../util/url';

import { colors, competitions } from '../data';

export default class CupHistory extends Component {
	
	render() {
		const seasonStyle = { lineHeight: '35px' };
		const rankStyle = { fontSize: '1.5em' };
		const activeStyle = { backgroundColor: colors.mediumyellow };
		const hasThirdPlace = this.hasThirdPlace();
		var headers = ['', '🏆', 2, 4, 4, 8, 8, 8, 8];

		if (window.innerWidth > 543) {
			seasonStyle.lineHeight = '50px';
		}

		if (hasThirdPlace) {
			headers[3] = 3;
		}

		return (
			<div className="CupHistory">
				<div className="flex-container" style={seasonStyle}>
					{headers.map((rank, index) => {
						return (
							<div key={index} className="flex-1" style={rankStyle}>
								{rank}
							</div>
						);
					})}
				</div>
				{this.props.seasons.map(season => {
					var teams = this.rankTeams(season);

					return (
						<div key={season.season} className="flex-container" style={seasonStyle}>
							<div className="flex-1" style={seasonStyle} >
								{this.getSeasonSpan(season.season)}
							</div>
							{teams.map((team, index) => {
								if (team === null)
									return <div className="flex-1" key={index}></div>;

								return (
									<div className="flex-1" key={team.name} style={team.active && activeStyle}>
										<Team team={team.name} year={season.season} emblemLarge={true} />
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}
	
	getSeasonSpan(year) {
		const fullyear = competitions[this.props.name].times !== undefined;
		const span = <Year year={year} fullyear={fullyear} />;
		const link = UrlUtil.getCompLink(year, this.props.name);

		if (link === null)
			return span;

		return (
			<Link to={link}>
				{span}
			</Link>
		);
	}

	hasThirdPlace() {
		const seasons = this.props.seasons;
		var i, season;
		var j, round;

		for (i = 0; i < seasons.length; i++) {
			season = seasons[i];

			for (j = 0; j < season.rounds.length; j++) {
				round = season.rounds[j];

				if (round.name === 'Third place' || round.name === '3td place') {
					return true;
				}
			}
		}

		return false;
	}

	rankTeams(season) {
		var teams = [];
		var groups = [];
		var i, round, group;
		var third = null;
		var j, k, index;

		for (i = 0; i <= 8; i++) {
			teams[i] = null;
		}

		if (season.winner)
			teams[1] = { name: season.winner };

		for (i = season.rounds.length - 1; i >= 0; i--) {
			round = season.rounds[i];
			group = MatchUtil.groupMatches(round.matches);

			if (round.name === 'Third place' || round.name === '3td place') {
				third = group[0];
			} else {
				groups.push(group);
			}
		}

		for (i = 0; i < groups.length; i++) {
			group = groups[i];

			for (j = 0; j < group.length; j++) {
				for (k = 1; k < teams.length; k++) {
					if (teams[k] === null) {
						teams[k] = { active: true, name: group[j].teams[0] };
						teams[k + 1] = { active: true, name: group[j].teams[1] };
						break;
					} else {
						index = group[j].teams.indexOf(teams[k].name);

						if (index >= 0)	{
							teams[k + (1 << i)] = { name: group[j].teams[1 - index] };
							break;
						}
					}
				}
			}
		}

		function swap(a, b) {
			var temp = teams[a];
			teams[a] = teams[b];
			teams[b] = temp;
		}

		if (third !== null) {
			var sum = MatchUtil.summarizeResult(third.matches[0], teams[3].name);
			if (sum.resultFull.includes('loss')) {
				swap(3, 4);
				swap(7, 8);
			}
		}

		teams.shift();

		return teams;
	}
}
