import React, { Component } from 'react';

import './style.css';

import {Team, Scoreboard, EmblemLarge} from '../Common';

import {seasons, competitions} from '../data';
import UrlUtil from '../../util/url';

export default class Home extends Component {
	
	constructor(props) {
		super(props);

		this.state = {competitions: []};
	}
	
	componentDidMount() {
		this.fetch();
	}

	render() {
		return (
			<div className="Recent">
				{this.state.competitions.map(comp => {
					if (comp.matches.length === 0)
						return null;

					var rows = [];
					var i, j, match;

					for (i = 0; i < comp.matches.length / 4; i++) {
						rows[i] = [];

						for (j = 0; j < 4; j++) {
							if (i * 4 + j < comp.matches.length) {
								match = comp.matches[i * 4 + j];
								rows[i][j] = (
										<div key={(i * 4 + j) * 2} className="flex-1">
											<div className="hide-mobile flex-container flex-container-center">
												<EmblemLarge team={match.teams[0]} />
												<div className="Recent-long-scoreboard">
													<Scoreboard team={match.teams[0]} match={match} player={this.state.player} />
												</div>
												<EmblemLarge team={match.teams[1]} />
											</div>
											<div className="show-mobile-flex flex-container flex-container-center">
												<Team name={match.teams[0]} emblemOnly={true} />
												<Scoreboard team={match.teams[0]} match={match} player={this.state.player} />
												<Team name={match.teams[1]} emblemOnly={true} />
											</div>
										</div>
									);
							} else {
								rows[i][j] = (<div key={i * 4 + j} className="flex-1" />);
							}
						}
					}

					return (
						<div key={comp.name}>
							<div className="Recent-comp text-center">{comp.name}</div>
							{rows.map((row, index) => {
								return (
									<div key={index} className="Recent-flex-container">
										{row}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}

	fetch() {
		const that = this;
		const url = UrlUtil.getRecentMatchesUrl(seasons.years.max);

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {

			var compMap = {};
			var comps = [];
			var i, j, match;

			j = 0;
			for (i in competitions) {
				if (i) {
					comps[j] = {name: competitions[i].name, matches: []};
					compMap[i] = j++;
				}
			}
			
			for (i = 0; i < data.length; i++) {
				match = data[i];
				match.dateO = new Date(match.date);
				j = compMap[match.competition];
				comps[j].matches.push(match);
			}
			
			for (i = 0; i < comps.length; i++) {
				comps[i].matches.sort((a, b) => {
					if (a.dateO.toString() === b.dateO.toString()) {
						if ((a.summary && b.summary) || !(a.summary || b.summary)) {
							return 0;
						} else {
							return a.summary ? -1 : 1;
						}
					}

					return a.dateO < b.dateO ? -1 : 1;
				});
			}

			that.setState({competitions: comps});
		});
	}
}
