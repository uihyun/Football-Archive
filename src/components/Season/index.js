import React, { Component } from 'react';

import './style.css';

import Match from '../Match';
import competitions from '../../dummy/competitions';

export default class Season extends Component {

	constructor(props) {
		super(props);
		this.state = {matches: []};
	}

	componentDidMount() {
		const that = this;
		const url='/api/season/select/2017';

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				const matches = that.getMatches(data.competitions);
				const season = data.season - 1 + '-' + data.season;
				that.setState({ season: season, matches: matches });
			});
	}

  render() {
    return (
      <div className="Season">
        <h1>
          {this.state.season} Season
        </h1>
				{this.state.matches.map(match => {
					return <Match key={match.date} match={match} />;
				})}
      </div>
    );
  }

	getMatches(competitions) {
		var out = [];
		var competition;
		var match;

		for (var i = 0; i < competitions.length; i++) {
			competition = competitions[i];

			for (var j = 0; j < competition.matches.length; j++) {
				match = JSON.parse(JSON.stringify(competition.matches[j]));
				match.competition = competition.name;
				match.dateO = new Date(match.date);
				out.push(match);
			}
		}

		out.sort(function(a, b) {
			a = a.dateO;
			b = b.dateO;
			return a > b ? 1 : a < b ? -1 : 0;
		});

		return out;
	}
}
