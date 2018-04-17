import React, { Component } from 'react';

import './style.css';

import PlayerName from '../../../util/playerName';

export default class MatchEvent extends Component {

	render() {
		const side = this.props.side;
		var minute = (<div className="MatchEvent-minute text-center">{this.props.minute}</div>);
		var type = null;
		var detail = null;
		
		if (this.props.goal) {
			[type, detail] = this.renderGoal();
		} else if (this.props.card) {
			[type, detail] = this.renderCard();
		} else if (this.props.sub) {
			[minute, type, detail] = this.renderSub();
		}
		
		var style = '';
		if (side === 'r') {
			style = 'MatchEvent-r-goal text-right';
		}

		return (
			<div className={'flex-container ' + style}>
				{minute} {type} {detail}
			</div>
		);
	}

	renderGoal() {
		const goal = this.props.goal;
		const type = (<div className="MatchEvent-minute text-center">⚽</div>);
		const className = goal.assist ? 'MatchEvent-scorer' : 'MatchEvent-solo';
		const detail = (
			<div className="MatchEvent-player">
				<div className={className}>
					{PlayerName.getDisplayName(goal.scorer)}
					{goal.style === 'own goal' && ' (own goal)'}
				</div>
				{goal.assist && <div className="MatchEvent-assist">assist by {PlayerName.getDisplayName(goal.assist)}</div>}
			</div>
		);

		return [type, detail];
	}

	renderCard() {
		const card = this.props.card;
		const colors = {yellow: 'hsl( 40, 100%, 50%)', red: 'hsl(360,  90%, 50%)'};
		const cardColor = {yellow: colors.yellow, red: colors.red, 'Second yellow': colors.red};
		const style = {color: cardColor[card.type]};
		const type = (<div className="MatchEvent-minute text-center MatchEvent-card" style={style}>▮ </div>);
		const detail = (
			<div className="MatchEvent-player MatchEvent-solo">
				{PlayerName.getDisplayName(card.player)}
			</div>
		);

		return [type, detail];
	}
	
	renderSub() {
		const sub = this.props.sub;
		const minute = (<div className="MatchEvent-minute text-center MatchEvent-sub">{this.props.minute}</div>);
		const type = (<div className="MatchEvent-minute text-center MatchEvent-sub">⇅</div>);
		//const type = (<div className="MatchEvent-minute text-center MatchEvent-sub">↑↓</div>);
		const detail = (
			<div className="MatchEvent-player MatchEvent-sub">
				<div className="MatchEvent-scorer">
					{PlayerName.getDisplayName(sub.in)}
				</div>
				<div className="MatchEvent-assist">
					for {PlayerName.getDisplayName(sub.out)}
				</div>
			</div>
		);

		return [minute, type, detail];
	}
}
