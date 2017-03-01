import React, { Component } from 'react';

import './style.css';

export default class Manage extends Component {

	constructor(props) {
		super(props);
		this.state = {season: 2017, seasonString: '2016-2017'}

		this.fetchSeason = this.fetchSeason.bind(this);
		this.clearSeason = this.clearSeason.bind(this);
	}

  render() {
    return (
      <div className="Season">
        <h2 className="header">
          {this.state.seasonString} Season
					<button onClick={this.fetchSeason}>
						Fetch
					</button>
					<button onClick={this.clearSeason}>
						Clear
					</button>
        </h2>
      </div>
    );
  }

	fetchSeason() {
		const that = this;
		const url = '/api/season/fetch/' + this.state.season;

		fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(data) {
				const matches = that.getMatches(data.competitions);
				console.log(data);
				that.setState({ matches: matches });
			});
	}

	clearSeason() {
		const that = this;
		const url = '/api/season/clear/' + this.state.season;

		fetch(url)
			.then(function(response) {
				console.log(response);
				that.setState({ matches: [] });
			})
	}
}
