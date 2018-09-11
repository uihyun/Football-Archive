import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { Scoreboard, Team } from '..';

import { competitions, rounds } from '../data';

import UrlUtil from '../../../util/url';

export default class Progress extends Component {

	render() {
		const team = this.props.team;
		const compName = this.props.competition.name;
		var rows = this.buildRows();

		return (
			<div className="Progress">
				<h3 className="text-center">{this.getTitle()}</h3>
				{rows.map((row, index) => {
					var style = { height: '21px', lineHeight: '21px' };
					var innerStyle = {};

					if (row.increaseHeight) {
						style.height = '42px';
						innerStyle.marginTop = '10.5px';
					}

					return (
						<div className="flex-container" style={style} key={index}>
							<div className="flex-1 flex-container-right-aligned Progress-left" style={innerStyle}>
								{rounds.getShortForm(compName, row.round)}
							</div>
							{row.view ? row.view :
								row.matches.map((match, index) => {
									if (match === null)
										return <div key={index} className="Progress-empty-match" />;
	
									return (
										<div className="flex-container" key={index}>
											<Scoreboard team={team} match={match} player={this.props.player} 
												shrinkOnMobile={true} />
										</div>
									);
								})
							}
							<div className="flex-1 Progress-right" style={innerStyle}>
								<Team team={row.team} hideMobileName={true} showShortName={true} year={this.props.year}/>
							</div>
						</div>
					);
				})}
			</div>
		);
	}

	getTitle() {
		const competition = this.props.competition;
		const matches = competition.matches;
		const qual = this.props.qual;
		var title = competitions[competition.name].name;
		var years = {min: 3000, max: 1000};
		var i, year;

		if (title.includes('WC')) {
			title = 'WCQ';
		}

		if (this.props.showYear) {
			for (i = 0; i < matches.length; i++) {
				year = parseInt(competition.matches[i].date.substring(6, 10), 10);
				years.min = Math.min(year, years.min);
				years.max = Math.max(year, years.max);
			}

			if (qual) {
				years.min = qual.season[0];
				years.max = qual.season[qual.season.length - 1];
			}

			title += ' ' + years.min;

			if (years.min !== years.max) {
				title = <span>{title}&#8209;{years.max}</span>;
			}
		}

		year = (years.max === 1000) ? this.props.year : years.max;
		const link = UrlUtil.getCompLink(year, competition.name);
		if (link) {
			return <Link to={link}>{title}</Link>;
		}

		return title;
	}

	getRankSuffix(rank) {
		if (rank === 1) {
			return rank + 'st';
		} else if (rank === 2) {
			return rank + 'nd';
		} else if (rank === 3) {
			return rank + 'rd';
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

	buildQualifierRows() {
		const competition = this.props.competition;
		const qual = this.props.qual;
		const team = this.props.team;

		if (qual === undefined)
			return [];

		var i, j, round, entry, match, selfview;
		var table = [];
		var tableIndex = 0;

		var roundNameMap = {};
		var matchMap = {};
		var matches;
		var teamMap, teams, vs;

		for (i = 0; i < competition.matches.length; i++) {
			match = competition.matches[i];
			round = match.round;

			if (qual.name === 'WC Qualifiers South America') {
				round = 'Group';
			}

			if (qual.name === 'WC Qualifiers CONCACAF') {
				if (round.match(/^Group/)) {
					round = '4 Round ' + round;
				} else if (round === '5 Round') {
					round = '5 Round Group';
				}
			}

			roundNameMap[round] = true;
			matchMap[round + match.place + match.vs] = match;
		}
		
		function findMatches(round, team) {
			var matches = [null, null];
			const places = ['H', 'A'];
			var k, key;

			for (k = 0; k < places.length; k++) {
				key = round + places[k] + team;
				if (matchMap[key]) {
					matches[k] = matchMap[key];
				}
			}

			key = round + 'N' + team;
			if (matchMap[key]) {
				for (k = 0; k < places.length; k++) {
					if (matches[k] === null) {
						matches[k] = matchMap[key];
						break;
					}
				}							
			}

			return matches;
		}

		for (i = qual.rounds.length - 1; i >= 0; i--) {
			round = qual.rounds[i];

			if (roundNameMap[round.name] === undefined)
				continue;

			if (round.table) {
				for (j = 0; j < round.table.length; j++) {
					entry = round.table[j];

					if (entry.name === team) {
						selfview = (<div className="Progress-self">{this.getRankSuffix(entry.rank)}</div>);
						table[tableIndex++] = { team: entry.name, round: '', view: selfview };
					} else {
						matches = findMatches(round.name, entry.name);
						table[tableIndex++] = { team: entry.name, matches: matches, round: entry.rank + '' };
					}
				}
			} else {
				teamMap = {};
				teams = [];

				for (j = 0; j < round.matches.length; j++) {
					match = round.matches[j];

					if (match.l === team) {
						if (teamMap[match.r] === undefined) {
							teamMap[match.r] = true;
							teams.push(match.r);
						}
					} else if (match.r === team) {
						if (teamMap[match.l] === undefined) {
							teamMap[match.l] = true;
							teams.push(match.l);
						}
					}
				}

				for (j = 0; j < teams.length; j++) {
					vs = teams[j];
					matches = findMatches(round.name, vs);
					table[tableIndex++] = { team: vs, matches: matches, round: round.name };
				}
			}
		}

		return table;
	}

	formatDate(date) {
		var array = date.split('/');
		return parseInt(array[2] + array[0] + array[1], 10); // mm/dd/yyyy
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

	formatGroupStage(rows, width) {
		var index = { min: rows.length, max: 0 };
		var roundName;
		var i, row, round;

		if (this.props.cup === undefined)
			return rows;

		for (i = 0; i < rows.length; i++) {
			row = rows[i];

			if (row.round.match(/^Group/)) {
				index.min = Math.min(index.min, i);
				index.max = Math.max(index.max, i);
				roundName = row.round;
			}
		}

		if (roundName === undefined)
			return rows;

		var newRows = [];
		var j, team, k, rank;
		var style, selfview;
		var className = (width === 2) ? 'Progress-neutral' : 'Progress-empty-match';

		for (i = 0; i < index.min; i++) {
			newRows[i] = rows[i];
		}

		for (i = index.max + 1; i < rows.length; i++) {
			newRows[i + 1] = rows[i];
		}

		for (i = 0; i < this.props.cup.rounds.length; i++) {
			round = this.props.cup.rounds[i];

			if (round.name === roundName && round.table) {
				for (j = 0; j < round.table.length; j++) {
					team = round.table[j];
					rank = 'G' + team.rank;

					for (k = index.min; k <= index.max; k++) {
						row = rows[k];

						if (row.team === team.name) {
							row.round = rank;
							newRows[index.min + j] = row;
							break;
						} else if (team.name === this.props.team) {
							rank = this.getRankSuffix(team.rank);

							if (width === 2) {
								rank = <span><small>Group </small>{rank}</span>;
							}

							style = { textAlign: 'center' };
							selfview = (<div style={style} className={className}>{rank}</div>);
							newRows[index.min + j] = { team: team.name, round: '', view: selfview };
							break;
						}
					}
				}
			}
		}

		return newRows;
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

		array = this.formatGroupStage(array, 2);

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

		array = this.formatGroupStage(array, 1);

		return array;
	}

	getMatchView(match, index) {
		const team = this.props.team;

		if (match === undefined || match === null)
			return <div key={index} className="Progress-empty-match" />;

		return (
			<div className="flex-container" key={index}>
				<Scoreboard team={team} match={match} player={this.props.player} 
					shrinkOnMobile={true} />
			</div>
		);
	}

	getDoubleLeagueView(row) {
		row.increaseHeight = true;

		var match0 = row.matches[0][0];
		var match1 = row.matches[1][0];
		var match2 = row.matches[0][1];
		var match3 = row.matches[1][1];

		var view = (
			<div>
				<div className="flex-container">
					{this.getMatchView(match0, 0)}
					{this.getMatchView(match1, 1)}
				</div>
				<div className="flex-container">
					{this.getMatchView(match2, 2)}
					{this.getMatchView(match3, 3)}
				</div>
			</div>
		);

		row.view = view;
	}

	buildDoubleLeagueRows() {
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
				table[i] = { team: entry.name, matches: [[], []], round: entry.rank + '' };
				teams[entry.name] = table[i];
			}
		}

		for (i = 0; i < competition.matches.length; i++) {
			match = competition.matches[i];

			row = teams[match.vs];

			if (row === undefined)
				continue;

			if (match.place === 'A') {
				row.matches[1].push(match);
			} else {
				row.matches[0].push(match);
			}
		}

		for (i = 0; i < table.length; i++) {
			row = table[i];

			if (row.view)
				continue;

			this.getDoubleLeagueView(row);
		}

		return table;
	}

	buildRows() {
		const desc = competitions[this.props.competition.name];
		var rows = [];

		switch (desc.type) {
			case 'L':
				rows = this.buildLeagueRows();
				break;
			case 'Q':
				rows = this.buildQualifierRows();
				break;
			case '2':
				rows = this.build2LeggedRows(); 
				break;
			case 'H':
				rows = this.buildHostedRows();
				break;
			case '4':
				rows = this.buildDoubleLeagueRows();
				break;
			default:
				break;
		}

		return rows;
	}
}
