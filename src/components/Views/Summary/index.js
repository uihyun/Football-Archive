import React, { Component } from 'react';

import './style.css';

import Scoreboard from '../../Scoreboard';
import Squad from '../../Squad';
import Team from '../../Team';

import rounds from '../../../data/rounds';

export default class Summary extends Component {

	constructor(props) {
		super(props);
		
		this.state = this.newState(this.props);

		this.selectPlayer = this.selectPlayer.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps));
	}

	selectPlayer(player) {
		this.setState({ player: player });
	}

	getScoreboard(match, key) {
		return (
			<div className="flex-container" key={key}
					 onClick={() => this.props.selectMatch(match)}>
				<Scoreboard key={key} team={this.props.team} match={match} player={this.state.player} />
			</div>
		);
	}

  render() {
		function displayRank(rank) {
			if (rank === 1) {
				return rank + 'st';
			} else if (rank === 2) {
				return rank + 'nd';
			} else {
				return rank + 'th';
			}
		}

		function displayRound(cup, round) {
			if (rounds[cup] !== undefined) {
				if (rounds[cup][round] !== undefined) {
					return rounds[cup][round];
				}
			}

			if (round.match(/^Group/)) {
				return 'G';
			}

			return round;
		}

    return (
			<div>
			<div className="flex-container">
				{this.state.europe.length > 0 &&
				<div className="flex-1">
					{this.state.europe.map(cup => {
						return (
							<div key={cup.name}>
								<h3 className="text-center">{cup.name}</h3>
								{cup.rounds.map(round => {
									return (
										<div className="flex-container Summary-team" key={round.team}>
											<div className="flex-1 flex-container-right-aligned Summary-left">{displayRound(cup.name, round.round)}</div>
											{this.getScoreboard(round.matches[0])}
											{round.matches.length > 1 ?
												this.getScoreboard(round.matches[1])
												: round.hideEmpty || <div className="Summary-empty-match" />
											}
											<div className="flex-1 Summary-right">
												<Team name={round.team} hideMobileName={true} showShortName={true} />
											</div>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
				}
				<div className="flex-1">
					<h3 className="text-center">EPL</h3>
					{this.state.league.map(team => {
						return (
							<div className="flex-container Summary-team" key={team.name}>
								<div className="flex-1 flex-container-right-aligned Summary-left">
									{team.name !== this.props.team && team.rank}
								</div>
								{
									team.name === this.props.team
									? <div className="Summary-self">{displayRank(team.rank)}</div>
									: team.matches.map(match => {
										return this.getScoreboard(match, match.place);
									})
								}
								<div className="flex-1 Summary-right">
									<Team name={team.name} hideMobileName={true} showShortName={true} />
								</div>
							</div>
						);
					})}
				</div>
				<div className="flex-1">
					{this.state.cups.map(cup => {
						return (
							<div key={cup.name}>
								<h3 className="text-center">{cup.name}</h3>
								{cup.rounds.map(round => {
									return (
										<div className="flex-container Summary-team" key={round.round}>
											<div className="flex-1 flex-container-right-aligned Summary-left">{displayRound(cup.name, round.round)}</div>
											{round.matches[0] ?
												this.getScoreboard(round.matches[0])
												: round.round !== 'Final' && <div className="Summary-empty-match" />
											}
											{round.matches[1] ?
												this.getScoreboard(round.matches[1])
												: round.round !== 'Final' && <div className="Summary-empty-match" />
											}
											<div className="flex-1 Summary-right">
												<Team name={round.team} hideMobileName={true} showShortName={true} />
											</div>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			</div>
			<br/>
			<Squad squad={this.props.squad} selectPlayer={this.selectPlayer} />
			</div>
    );
  }

	newState(props) {
		const data = props.data;
		var out = {league: [], cups: [], europe: [], player: null};

		if (data.leagues === undefined) {
			return out; // data not yet fetched
		}

		var leagueName = data.leagues[0].name;

		var i;
		var entry;
		var table = [];
		var teams = {};
		for (i = 0; i < data.leagues[0].table.length; i++) {
			entry = data.leagues[0].table[i];
			table[i] = { name: entry.name, matches: [], rank: entry.rank };
			teams[entry.name] = table[i];
		}
		out.league = table;

		var j, k;
		var match;
		var team;
		var cup, prevMatch, name, found, round;
		for (i = 0; i < data.competitions.length; i++) {
			entry = data.competitions[i];

			if (entry.name === leagueName) {
				for (j = 0; j < entry.matches.length; j++) {
					match = entry.matches[j];

					team = teams[match.vs];

					if (match.place === 'A') {
						team.matches[1] = match;
					} else {
						team.matches[0] = match;
					}
				}
			} else if (entry.name === 'FA Cup' || 
								 entry.name === 'League Cup' ||
								 entry.name === 'FA Community Shield') {
				cup = {name: entry.name, rounds: []};

				if (entry.name === 'FA Community Shield')
					cup.name = 'Community Shield';

				prevMatch = {};
				for (j = 0; j < entry.matches.length; j++) {
					match = entry.matches[j];
					if (match.round === prevMatch.round) {
						if (match.place === 'A') {
							round.matches[1] = match;
						} else {
							round.matches[0] = match;
						}
					} else {
						round = {
							round: match.round,
							team: match.vs,
							matches: []
						};

						if (match.place === 'A') {
							round.matches[1] = match;
						} else {
							round.matches[0] = match;
						}

						cup.rounds.push(round);
						prevMatch = match;
					}
				}

				cup.rounds.reverse();
				out.cups.push(cup);
			} else if (entry.name.match(/^Champions|^Europa|^Club|^UEFA/)) {
				name = entry.name.replace(/ Qual./, '');
				cup = {name: name, rounds: []};
				for (j = 0; j < out.europe.length; j++) {
					if (out.europe[j].name === name) {
						cup = out.europe[j];
					}
				}

				if (entry.name === 'UEFA-Supercup')
					cup.name = 'UEFA Super Cup';

				if (cup.rounds.length === 0) {
					out.europe.push(cup);
				}

				prevMatch = {};
				for (j = 0; j < entry.matches.length; j++) {
					match = entry.matches[j];
					if (match.round === prevMatch.round) {
						if (match.round.match(/^Group/)) {
							found = false;
							for (k = 0; k < cup.rounds.length; k++) {
								if (cup.rounds[k].team === match.vs) {
									cup.rounds[k].matches[1] = match;
									if (cup.rounds[k].matches[0].place === 'A') {
										cup.rounds[k].matches.reverse();
									}
									found = true;
									break;
								}
							}

							if (found === false) {
								cup.rounds.push({
									round: match.round,
									team: match.vs,
									matches: [match]
								});
							}
						} else {
							cup.rounds[cup.rounds.length - 1].matches[1] = match;
							if (match.place === 'H') {
								cup.rounds[cup.rounds.length - 1].matches.reverse();
							}
						}
					} else {
						cup.rounds.push({
							round: match.round,
							team: match.vs,
							matches: [match]
						});
						prevMatch = match;
					}
				}

				for (j = 0; j < cup.rounds.length; j++) {
					round = cup.rounds[j];
					if (entry.name.match(/^Club/) || round.round === 'Final') {
						round.hideEmpty = true;
					}
				}
			}
		}

		for (i = 0; i < out.europe.length; i++) {
			cup = out.europe[i];
			cup.rounds.sort(function (a, b) {
				var aDate = a.matches[0].date.split('/');
				var bDate = b.matches[0].date.split('/');
				var aStr = aDate[2] + aDate[0] + aDate[1];
				var bStr = bDate[2] + bDate[0] + bDate[1];

				return bStr - aStr;
			});
		}

		return out;
	}
}
