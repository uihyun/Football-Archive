import React, { Component } from 'react';

import './style.css';

import Match from '../Match';
import competitions from '../../dummy/competitions';

export default class Season extends Component {

	// I think this should be on the server, but there's no server yet
	getMatches(competitions) {
		var out = [];
		var competition;
		var match;

		for (var i = 0; i < competitions.length; i++) {
			competition = competitions[i];

			for (var j = 0; j < competition.matches.length; j++) {
				match = JSON.parse(JSON.stringify(competition.matches[j]));
				match.competition = competition.name;
				out.push(match);
			}
		}

		out.sort(function(a, b) {
			a = a.date.split('/').reverse().join('');
			b = b.date.split('/').reverse().join('');
			return a > b ? 1 : a < b ? -1 : 0;
		});

		return out;
	}

  render() {
		const matches = this.getMatches(competitions);
    return (
      <div className="Season">
        <h1>
          Season
        </h1>
				{matches.map(match => {
					return <Match key={match.date} match={match} />;
				})}
      </div>
    );
  }
}
