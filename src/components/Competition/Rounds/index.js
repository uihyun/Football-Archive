import React, { Component } from 'react';

import './style.css';

import { Grid, ViewSelector } from '../../Common';

import { rounds as roundData } from '../data';

import MatchUtil from '../../../util/match';

export default class Rounds extends Component {
	
	render() {
		return (
			<ViewSelector views={this.getViews()} />
		);
	}

	getViews() {
		const comp = this.props.comp;
		const [earlyRounds, finals] = this.groupFinals();
		var views = [];
		var i, round, group, name;

		if (finals.length > 0) {

			views.push({
				name: 'Finals',
				view: (
					<div>
						<div className="flex-container">
							<div className="flex-1" />
							<div className="flex-2">
								{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Final'))}
							</div>
							<div className="flex-1">
								{this.getFinalRoundView(this.getFinalByRoundName(finals, '3/4'))}
							</div>
						</div>
						{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Semi-finals'))}
						{this.getFinalRoundView(this.getFinalByRoundName(finals, 'Quarter-finals'))}
					</div>
				)
			});
		}

		for (i = 0; i < earlyRounds.length; i++) {
			round = earlyRounds[i];
			group = MatchUtil.groupMatches(round.matches);
			name = round.name.replace(/\./, '');
			name = name.replace(/Zwischenrunde/, 'Play-off');

			views.push({
				name: name,
				sh: roundData.getShortForm(comp.name, name),
				view: (
					<div>
						<br/>
						<Grid matches={group} year={this.props.comp.season} />
					</div>
				)
			});
		}

		return views;
	}

	getFinalRoundView(round) {
		if (round === null)
			return null;
			
		var style = {
			height: '32px',
			fontSize: '1.5em',
			textAlign: 'center'
		};

		if (round.name === '3/4') {
			style.lineHeight = '32px';
			style.fontSize = '1.2em';
		}
		
		return (
			<div>
				<div style={style}>{round.name}</div>
				<Grid matches={round.group} year={this.props.comp.season} noFiller={true} />
			</div>
		);
	}

	getFinalByRoundName(rounds, name) {
		var i, round;
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name === name)
				return round;
		}

		return null;
	}

	groupFinals() {
		const rounds = this.props.rounds;
		var earlyRounds = [];
		var third = null;
		var finals = [];
		var i, round;
		
		for (i = 0; i < rounds.length; i++) {
			round = rounds[i];

			if (round.name === 'Final' ||
					round.name === 'Semi-finals' ||
					round.name === 'Quarter-finals') {
				finals.push({name: round.name, group: MatchUtil.groupMatches(round.matches)});
			} else if (round.name === 'Third place' || round.name === '3td place') {
				third = {name: '3/4', group: MatchUtil.groupMatches(round.matches)};
			} else {
				earlyRounds.push(round);
			}
		}
		
		var prev, group;
		var j, k, l;

		for (i = 1; i < finals.length; i++) {
			prev = finals[i - 1];
			round = finals[i];
			group = [];

			for (j = 0; j < prev.group.length; j++) {
				for (k = 0; k < round.group.length; k++) {
					for (l = 0; l < 2; l++) {
						if (round.group[k].teams.includes(prev.group[j].teams[l])) {
							group[j * 2 + l] = round.group[k];
						}
					}
				}
			}

			round.group = group;
		}

		if (third !== null) {
			finals.push(third);
		}

		return [earlyRounds, finals];
	}
}
