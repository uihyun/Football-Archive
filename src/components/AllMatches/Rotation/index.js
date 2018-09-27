import React, { Component } from 'react';

import './style.css';

import {Scoreboard, Team} from '../../Common';

import Match from '../../../util/match';
import SquadUtil from '../../../util/squad';
import PlayerNameUtil from '../../../util/playerName';

import { competitions } from '../data';

export default class Rotation extends Component {

	render() {
		const allMatches = Match.extractAndSort(this.props.data.data);
		const data = Match.getShortenedData(allMatches);
		var matches = Match.extractAndSort(data);
		const team = this.props.data.team;
		var squad = SquadUtil.getStatistics(data, this.props.data.team);

		const playedMatches = matches.filter(m => m.summary);
		const futureMatches = matches.filter(m => m.summary === undefined);

		if (this.props.data.player) {
			squad.appearances = squad.appearances.filter(p => p.name === this.props.data.player.fullname);
		}

		var gridStyle = {
			display: 'grid',
			gridTemplateColumns: '1fr 1fr',
		};

		var cellStyle = {
			width: '35px',
			height: '21px'
		};

		return (
			<div style={gridStyle}>
				<div className="flex-container-right-aligned">
					{playedMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							{ competitions[match.competition].sh }
						</div>
					)}
				</div>
				<div className="flex-container">
					{futureMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							{ competitions[match.competition].sh }
						</div>
					)}
				</div>
				<div className="flex-container-right-aligned">
					{playedMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							<Team team={match.vs} year={this.props.data.year} emblemSmall={true}/>
						</div>
					)}
				</div>
				<div className="flex-container">
					{futureMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							<Team team={match.vs} year={this.props.data.year} emblemSmall={true}/>
						</div>
					)}
				</div>
				<div className="flex-container-right-aligned">
					{playedMatches.map((match, index) =>
						<Scoreboard key={index} team={team} match={{date: match.date}} />
					)}
				</div>
				<div className="flex-container">
					{futureMatches.map((match, index) =>
						<Scoreboard key={index} team={team} match={{date: match.date}} />
					)}
				</div>
				<div className="flex-container-right-aligned">
					{playedMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							<sup>{ match.place }</sup>
						</div>
					)}
				</div>
				<div className="flex-container">
					{futureMatches.map((match, index) =>
						<div key={index} style={cellStyle} className="text-center">
							<sup>{ match.place }</sup>
						</div>
					)}
				</div>
				<div className="flex-container-right-aligned">
					{playedMatches.map((match, index) => 
						<Scoreboard key={index} team={team} match={match} />
					)}
				</div>
				<div/>
				{squad.appearances.map(player => {
					var name = player.name;
					var dummy = {fullname: name};
					var scoreboards = playedMatches.map((match, index) => 
						<Scoreboard key={index} team={team} match={match} player={dummy} />
					);
					return [
						<div className="flex-container-right-aligned" key={'scoreboards'}>
							{scoreboards}
						</div>,
						<div key={'player'} style={{marginLeft: '10px'}}>
							{PlayerNameUtil.capitalize(PlayerNameUtil.divide(player.name).last)}
						</div>
					];
				})}
			</div>
		);
	}

}
