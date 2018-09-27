import React, { Component } from 'react';

import './style.css';

import {Competition, Team, Scoreboard} from '../../Common';

import Match from '../../../util/match';

export default class Timeline extends Component {

  render() {
		const matches = Match.extractAndSort(this.props.data.data);

    return (
      <div className="Timeline">
				{matches.map((match, index) => {return this.getMatchView(match, index);})}
      </div>
    );
  }

	getMatchView(match, index) {
		const year = match.season ? match.season : this.props.data.year;
		return (
			<div key={index} className="flex-container">
				<div className="flex-1 Timeline-margin flex-container-right-aligned">
					<Competition name={match.competition} round={match.round} year={year} />
				</div>
				<Scoreboard classNames="Timeline-margin" team={this.props.data.team} match={match} 
				 player={this.props.data.player}/>
				<div className="flex-1 Timeline-margin Timeline-team">
					<Team team={match.vs} year={this.props.data.year} />
				</div>
			</div>
		);
	}
}
