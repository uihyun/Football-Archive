import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import MatchEvent from './MatchEvent';
import {Team} from '../Common';

import {teams} from '../data';

import UrlUtil from '../../util/url';

export default class OneMatch extends Component {
	
	constructor(props) {
		super(props);

		const url = this.props.match.params.url;

		this.state = {url: url, match: null};
	}

	componentDidMount() {
		this.fetch();
	}

	render() {
		if (this.state.match === null) {
			return null;
		}

		const match = this.state.match;
		const year = match.season;
		const summary = match.summary;
		var l, r;

		if (summary) {
			l = summary.l;
			r = summary.r;
		} else {
			l = match.teams[0];
			r = match.teams[1];
		}

		const shortL = (teams[l] !== undefined) ? teams[l].name : l;
		const shortR = (teams[r] !== undefined) ? teams[r].name : r;

		const goals = this.getGoals();
		const cards = this.getCards();
		const subs = this.getSubs();
		const events = this.getEvents(goals, cards, subs);
	
		return (
			<div>
				<h3 className="text-center">
					<div>{match.competition} {match.round}</div>
					<div><small>{match.date}</small></div>
				</h3>
				<div className="flex-container">
					<div className="flex-1 hide-mobile"></div>
					<div className="flex-2">
						<div className="flex-container OneMatch-team">
							<div className="flex-1"><span className="hide-mobile">{l}</span><span className="show-mobile">{shortL}</span></div>
							<div className="flex-1 text-right"><span className="hide-mobile">{r}</span><span className="show-mobile">{shortR}</span></div>
						</div>
						<div className="flex-container">
							<div className="flex-1"><Team team={l} emblemLarge={true} year={year}/></div>
							<div className="flex-1 text-center OneMatch-score">{this.getScore()}</div>
							<div className="flex-1 text-right"><Team team={r} emblemLarge={true} year={year}/></div>
						</div>
						{events.map((e, index) => {return (this.getEventDiv(e, index));})}
					</div>
					<div className="flex-1 hide-mobile"></div>
				</div>
				<div className="text-center" onClick={this.props.showVersus}>
					<Link to={'/versus/' + UrlUtil.getTeamUrl(l) + '/' + UrlUtil.getTeamUrl(r)}>
						see history
					</Link>
				</div>
			</div>
		);
	}
	
	getSubs() {
		const summary = this.state.match.summary;

		if (summary === undefined || summary.players === undefined)
			return [];

		var sides = ['l', 'r'];
		var lineup = ['start', 'sub'];
		var players;
		var i, side;
		var j, pos;
		var k, player;
		var l, sub, subIn;
		var subs = [];

		for (i = 0; i < sides.length; i++) {
			side = sides[i];
			players = summary.players[side];

			for (j = 0; j < lineup.length; j++) {
				pos = lineup[j];
				if (players[pos] === undefined)
					continue;

				for (k = 0; k < players[pos].length; k++) {
					player = players[pos][k];
					subIn = null;
				
					if (player.sub) {
						if (pos === 'start') {
							subs.push({
								minute: player.sub,
								side: side,
								out: player.name
							});
						} else if (player.sub.length) {
							subs.push({
								minute: player.sub[1],
								side: side,
								out: player.name
							});
							subIn = player.sub[0];
						} else {
							subIn = player.sub;
						}
					}
					
					if (subIn) {
						for (l = 0; l < subs.length; l++) {
							sub = subs[l];

							if (sub.side === side && sub.minute === subIn && sub.in === undefined) {
								sub.in = player.name;
								break;
							}
						}
					}
				}
			}
		}

		console.log(subs);

		return subs;
	}

	getCards() {
		const summary = this.state.match.summary;

		if (summary === undefined || summary.players === undefined)
			return [];

		var sides = ['l', 'r'];
		var lineup = ['start', 'sub'];
		var players;
		var i, side;
		var j, pos;
		var k, player;
		var cards = [];

		for (i = 0; i < sides.length; i++) {
			side = sides[i];
			players = summary.players[side];

			for (j = 0; j < lineup.length; j++) {
				pos = lineup[j];
				if (players[pos] === undefined)
					continue;

				for (k = 0; k < players[pos].length; k++) {
					player = players[pos][k];
				
					if (player.card) {
						if (player.card.type === 'yellow')
							continue;

						cards.push({
							minute: player.card.minute,
							side: side,
							player: player.name,
							type: player.card.type
						});
					}
				}
			}
		}

		return cards;
	}

	getGoals() {
		const summary = this.state.match.summary;
		return (summary) ? summary.goals : [];
	}

	getEvents(goals, cards, subs) {
		var events = [];

		goals.forEach(goal => {
			events.push({ minute: goal.minute, side: goal.side, goal: goal });
		});

		cards.forEach(card => {
			events.push({ minute: card.minute, side: card.side, card: card });
		});
		
		subs.forEach(sub => {
			events.push({ minute: sub.minute, side: sub.side, sub: sub });
		});

		events.sort((a, b) => { return a.minute - b.minute } );

		return events;
	}

	getEventDiv(e, index) {
		return (
			<MatchEvent key={index} minute={e.minute} side={e.side}
									goal={e.goal} card={e.card} sub={e.sub} />
		);
	}

	getScore() {
		if (this.state.match.summary === undefined) {
			return '';
		}

		const goals = this.state.match.summary.goals;
		var l = 0;
		var r = 0;

		for (var i in goals) {
			if (goals[i].side === 'l') {
				l++;
			} else {
				r++;
			}
		}

		return l + ' : ' + r;
	}

	fetch() {
		const that = this;
		const url = UrlUtil.getMatchSelectUrl(this.state.url);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			that.setState({match: data});
		});
	}

}
