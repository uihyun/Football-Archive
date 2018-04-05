import React, { Component } from 'react';

import './style.css';

import {Scoreboard, Team} from '..';

import {rounds, competitions} from '../data';

export default class Progress extends Component {

	render() {
		const team = this.props.team;
		const compName= this.props.competition.name;
		var rows = this.buildRows();

		return (
			<div className="Progress">
				<h3 className="text-center">{competitions[compName].name}</h3>
				{rows.map((row, index) => {
					return (
						<div className="flex-container Progress-team" key={index}>
							<div className="flex-1 flex-container-right-aligned Progress-left">
								{rounds.getShortForm(compName, row.round)}
							</div>
							{row.view ? row.view :
								row.matches.map((match, index) => {
									if (match === null)
										return <div key={index} className="Progress-empty-match" />;
	
									return (
										<div className="flex-container" key={index}>
											<Scoreboard team={team} match={match} player={this.props.player} />
										</div>
									);
								})
							}
							<div className="flex-1 Progress-right">
								<Team team={row.team} hideMobileName={true} showShortName={true} year={this.props.year}/>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	getRankSuffix(rank) {
		if (rank === 1) {
			return rank + 'st';
		} else if (rank === 2) {
			return rank + 'nd';
		} else {
			return rank + 'th';
		}
	}

	buildLeagueRows() {
		const competition = this.props.competition;
		const leagueTable = this.props.leagueTable;
		const team = this.props.team;

		if (leagueTable === undefined)
			return [];
		
		var i, entry, match, row, selfview;
		var table = [];
		var teams = {};

		for (i = 0; i < leagueTable.length; i++) {
			entry = leagueTable[i];

			if (entry.name === team) {
				selfview = (<div className="Progress-self">{this.getRankSuffix(entry.rank)}</div>);
				table[i] = { team: entry.name, round: '', view: selfview };
			} else {
				table[i] = { team: entry.name, matches: [null, null], round: entry.rank + '' };
				teams[entry.name] = table[i];
			}
		}

		for (i = 0; i < competition.matches.length; i++) {
			match = competition.matches[i];

			row = teams[match.vs];

			if (row === undefined)
				continue;

			if (match.place === 'A') {
				row.matches[1] = match;
			} else {
				row.matches[0] = match;
			}
		}

		return table;
	}

	formatDate(date) {
		var array = date.split('/');
		return parseInt(array[2] + array[0] + array[1], 10); // mm/dd/yyyy
	}
		
	formatRound(compName, round) {
		if (rounds[compName] !== undefined) {
			if (rounds[compName][round] !== undefined) {
				return rounds[compName][round];
			}
		}

		if (round.match(/^Group/)) {
			return 'G';
		}

		return round;
	}

	getRoundKey(competition, match) {
		if (competition.name === 'Friendlies') {
			return match.date;
		} else if (competition.name === 'WC Qualifiers South America') {
			return match.vs;
		} else {
			return match.round + match.vs;
		}
	}
	
	getRoundName(competition, match) {
		if (competition.name === 'Friendlies') {
			return match.date.substring(8, 10);
		} else if (competition.name === 'WC Qualifiers South America') {
			return '1R';
		} else {
			return match.round;
		}
	}

	build2LeggedRows() {
		const competition = this.props.competition;
	
		var i, match, row, key, round, place;
		var map = {};
		var array = [];
		for (i = 0; i < competition.matches.length; i++) {
			match = competition.matches[i];
			key = this.getRoundKey(competition, match);
			row = map[key];

			if (row === undefined) {
				round = this.getRoundName(competition, match);
				row = { team: match.vs, matches: [], dateMin: 100000000, round: round };
				map[key] = row;
				array.push(row);
			}

			row.matches.push(match);
			row.dateMin = Math.min(row.dateMin, this.formatDate(match.date));
		}

		array.sort(function (a, b) { return b.dateMin - a.dateMin; });

		for (i = 0; i < array.length; i++) {
			row = array[i];

			if (row.round === 'Final')
				continue;

			if (row.matches.length === 2) {
				if (row.matches[0].place !== 'H') {
					place = row.matches[0].place + row.matches[1].place;
					if (place !== 'NA') {
						row.matches.reverse();
					}
				}
			} else {
				match = row.matches[0];
				switch (match.place) {
					case 'H':
						row.matches = [match, null];
						break;
					case 'A':
						row.matches = [null, match];
						break;
					case 'N':
					default:
						row.view = (
							<div className="flex-container flex-container-center Progress-neutral">
								<Scoreboard team={this.props.team} match={match} player={this.props.player} />
							</div>
						);
						break;
				}
			}
		}

		return array;
	}

	buildHostedRows() {
		const competition = this.props.competition;
	
		var i, match, date;
		var array = [];
		for (i = 0; i < competition.matches.length; i++) {
			match = competition.matches[i];
			date = this.formatDate(match.date);
			array.push({ team: match.vs, matches: [match], date: date, round: match.round });
		}

		array.sort(function (a, b) { return b.date - a.date; });

		return array;
	}

	buildRows() {
		const desc = competitions[this.props.competition.name];
		var rows = [];

		switch (desc.type) {
			case 'L':
				rows = this.buildLeagueRows();
				break;
			case '2':
				rows = this.build2LeggedRows(); 
				break;
			case 'H':
				rows = this.buildHostedRows();
				break;
			default:
				break;
		}

		return rows;
	}
}
