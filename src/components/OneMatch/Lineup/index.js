import React, { Component } from 'react';

import './style.css';

import { Assist, Goal, PlayerName } from '../../Common';

import { colors } from '../data';

export default class Lineup extends Component {

	render() {
		return (
			<div className="Lineup">
				{this.getPlayers(this.props.data.side)}
			</div>
		);
	}

	getGoals(player) {
		var array = [];

		const goals = this.props.data.summary.goals;
		var i, goal, og, pk;

		for (i = 0; i < goals.length; i++) {
			goal = goals[i];
			og = (goal.style === 'own goal');
			pk = (goal.style === 'penalty');

			if (goal.scorer === player.name) {
				array.push(<div key={'goal' + i} className="Lineup-goal"><Goal og={og} pk={pk} /></div>);
			}

			if (goal.assist === player.name) {
				array.push(<div key={'assist' + i} className="Lineup-goal"><Assist /></div>);
			}
		}

		return array;
	}

	getPlayerView(player, pos) {
		var array = [];

		array.push(<div key="b" className="Lineup-backnumber text-center">{player.number}</div>);
		array.push(<div key="n"><PlayerName player={player.name} /></div>);

		var goals = this.getGoals(player);
		var i;

		for (i = 0; i < player.assist; i++) {
			goals.push(<div key={'assist' + i} className="Lineup-goal"><Assist /></div>);
		}

		if (goals.length)
			array.push(<div key="g" className="flex-container">{goals}</div>);

		if (player.card) {
			const cardColor = {yellow: colors.yellow, red: colors.red, 'Second yellow': colors.red};
			const style = {fill: cardColor[player.card.type]};

			array.push(
				<div key="c" className="Lineup-card">
					<svg width={14} height={20}>
						<rect x={3} y={6} width={8} height={12} style={style} />
					</svg>
				</div>
			);
		}
		
		if (player.sub) {
			if (pos === 'sub') {
				if (player.sub.length === undefined) {
					array.push(<div key="sub_in">▲</div>);
				} else {
					array.push(<div key="sub_in">▲</div>);
					array.push(<div key="sub_out">▼</div>);
				}
			} else {
				array.push(<div key="sub_out">▼</div>);
			}
		}
			
		return array;
	}

	getSorted(array) {
		var i;
		var sorted = [];

		for (i = 0; i < array.length; i++) {
			sorted.push(array[i]);
		}

		sorted.sort((a, b) => { return a.number - b.number; } );

		return sorted;
	}

	getPlayers(side) {
		if (this.props.data.summary.players === undefined)
			return null;

		const players = this.props.data.summary.players[side];
		var lineup = ['start', 'sub'];
		var j, pos, sorted;
		var k, player;
		var style = {};
		var array = [];

		if (side === 'r') {
			style.flexDirection = 'row-reverse';
			style.textAlign = 'right';
		}

		for (j = 0; j < lineup.length; j++) {
			pos = lineup[j];
			if (players[pos] === undefined)
				continue;

			array.push({ key: pos, view: <div><br/><b>{pos.toUpperCase()}</b></div> });

			sorted = this.getSorted(players[pos]);

			for (k = 0; k < sorted.length; k++) {
				player = sorted[k];
				array.push({ key: player.name, view: this.getPlayerView(player, pos) });
			}
		}

		return array.map(e => {
			return <div className="Lineup-player flex-container" style={style} key={e.key}>{e.view}</div>
		});
	}
}
