import React, { Component } from 'react';
import {Link} from 'react-router-dom';

import './style.css';

import Match from '../../../util/match'

export default class Scoreboard extends Component {
  render() {
		const shrink = this.props.shrinkOnMobile ? ' Scoreboard-shrink ' : '';
		if (this.props.isEmpty) {
			return <div className={'Scoreboard' + shrink}></div>;
		}

		const match = this.props.match;
		const dateA = match.date.split('/');
		const mm = dateA[0];
		const dd = dateA[1];
		const summary = match.summary;
		let score = null;
		let bg = null;
		const sum = Match.summarizeResult(match, this.props.team);
		let scoreStyle = 'Scoreboard-' + sum.resultFull;

		if (summary) {
			score = (
				<div className="flex-container text-center Scoreboard-score">
					<div className="flex-1"></div>
					<div className="flex-2">{sum.goalsScored}</div>
					<div>:</div>
					<div className="flex-2">{sum.goalsConceded}</div>
					<div className="flex-1"></div>
				</div>
			);
			
			const side = (summary.r === this.props.team) ? 'r' : 'l';

			if (this.props.player && this.props.player.fullname) {

				if (summary.players === undefined) {
					score = null;
				} else {
					var fullname = this.props.player.fullname;
					bg = this.playerBackground(summary.players[side], fullname, scoreStyle);
					if (this.playerPlayed(summary.players[side], fullname)) {
						score = this.playerScored(summary.goals, side, fullname);
					} else {
						scoreStyle += '-didNotPlay';
						score = null;
					}
				}
			}
		} else {
			score = <span className='Scoreboard-date'>{mm + '/' + dd}</span>;
		}

		let className = this.props.classNames + ' Scoreboard ' + shrink + scoreStyle;
		var inner = [bg, (<div key={1} className='Scoreboard-inner'>{score}</div>)];

		if (match.url === undefined) {
	    return (<div className={className}>{inner}</div>);
		}

    return (
			<div className={className}>
				<Link to={'/match/' + match.url}>
					{inner}
				</Link>
			</div>
		);
	}

	playerBackground(players, player, style) {
		for (var i = 0; i < players.start.length; i++) {
			if (players.start[i].name === player) {
				if (players.start[i].sub) {
					return <div key={0} className={style + '-out Scoreboard-out'}></div>;
				} else {
					return null;
				}
			}
		}

		let length = players.sub === undefined ? 0 : players.sub.length;

		for (i = 0; i < length; i++) {
			if (players.sub[i].name === player) {
				if (players.sub[i].sub) {
					return <div key={0} className={style + '-in Scoreboard-in'}></div>;
				} else {
					return null;
				}
			}
		}

		return null;
	}

	playerPlayed(players, player) {
		for (var i = 0; i < players.start.length; i++) {
			if (players.start[i].name === player) {
				return true;
			}
		}
		
		let length = players.sub === undefined ? 0 : players.sub.length;

		for (i = 0; i < length; i++) {
			if (players.sub[i].name === player) {
				return (players.sub[i].sub !== undefined);
			}
		}

		return false;
	}

	playerScored(goals, side, player) {
		var goal;
		var goalCount = 0;
		var assistCount = 0;

		for (var i = 0; i < goals.length; i++) {
			goal = goals[i];

			if (goal.side !== side)
				continue;

			if (goal.scorer === player)
				goalCount++;

			if (goal.assist === player)
				assistCount++;
		}

		var a = '';
		if (assistCount > 0) {
			if (assistCount > 1) {
				a = assistCount;
			}
			a += 'a';
		}
		
		var g = '';
		if (goalCount > 0) {
			if (goalCount > 1) {
				g = goalCount;
			}
			g += '⚽';
		}

		return g + a;
	}
}
