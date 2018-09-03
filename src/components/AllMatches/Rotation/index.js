import React, { Component } from 'react';

import './style.css';

import {Scoreboard, PlayerName, Team} from '../../Common';

import Match from '../../../util/match';
import SquadUtil from '../../../util/squad';

import { competitions } from '../data';

export default class Rotation extends Component {

	render() {
		const allMatches = Match.extractAndSort(this.props.data.data);
		const data = Match.getShortenedData(allMatches);
		var matches = Match.extractAndSort(data);
		const team = this.props.data.team;
		var squad = SquadUtil.getStatistics(data, this.props.data.team);

		matches = matches.filter(m => m.summary).reverse();

		if (this.props.data.player) {
			squad.appearances = squad.appearances.filter(p => p.name === this.props.data.player.fullname);
		}

		var gridStyle = {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
			gridColumnGap: '10px'
		}

		return (
			<div style={gridStyle}>
				<div/>
				<div className="flex-container">
					{matches.map((match, index) =>
						<div key={index} style={{width: '35px', height: '21px'}} className="text-center">
							{ competitions[match.competition].sh }
						</div>
					)}
				</div>
				<div/>
				<div className="flex-container">
					{matches.map((match, index) =>
						<div key={index} style={{width: '35px', height: '21px'}} className="text-center">
							<Team team={match.vs} year={this.props.data.year} emblemSmall={true}/>
						</div>
					)}
				</div>
				<div/>
				<div className="flex-container">
					{matches.map((match, index) =>
						<Scoreboard key={index} team={team} match={{date: match.date}} />
					)}
				</div>
				<div/>
				<div className="flex-container">
					{matches.map((match, index) => 
						<Scoreboard key={index} team={team} match={match} />
					)}
				</div>
				{squad.appearances.map(player => {
					var name = player.name;
					var dummy = {fullname: name};
					var scoreboards = matches.map((match, index) => 
						<Scoreboard key={index} team={team} match={match} player={dummy} />
					);
					return [
						<div key={'player'} className="text-right">
							<PlayerName player={name} />
						</div>,
						<div className="flex-container" key={'scoreboards'}>
							{scoreboards}
						</div>
					];
				})}
			</div>
		);
	}

}
