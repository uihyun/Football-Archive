import React, { Component } from 'react';

import './style.css';

import LeagueTable from '../../LeagueTable';
import Cup from '../../Cup';
import competitions from '../../../data/competitions';

export default class Standings extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			comp: 'L'
		};

		this.selectComp = this.selectComp.bind(this);
	}


	render() {
		return (
			<div>
				{this.getDesktopView()}
				{this.getMobileView()}
			</div>
		);
	}

	getDesktopView() {
		return (
			<div className="hide-mobile">
				{this.props.data.leagues[0] &&
					<LeagueTable league={this.props.data.leagues[0]} team={this.props.team} />
				}
				<div className="flex-container-adaptive flex-container-space-evenly">
					{this.props.data.cups.map(cup => {
						let style = { order: competitions[cup.name].order };

						return (
							<div key={cup.name} style={style}>
								<Cup team={this.props.team} cup={cup} />
							</div>
						);
					})}
				</div>
			</div>
		);
	}
	
	getMobileView() {
		let headers = this.getMobileHeaders();

		return (
			<div className="show-mobile">
				<div className="text-center flex-container">
					{headers.map(header => {
						var style = {};

						if (header === this.state.comp) {
							style.fontWeight = 'bold';
						}

						return (
							<div key={header} style={style} className="flex-1" onClick={() => this.selectComp(header)}>
								{header}
							</div>
						);
					})}
				</div>
				{this.getMobileSubView()}
			</div>
		);
	}

	getMobileHeaders() {
		var headers = ['L'];
		var cups = [];

		this.props.data.cups.forEach(cup => {
			cups.push(cup.name);
		});

		cups.sort(function (a, b) { return competitions[a].order - competitions[b].order });

		cups.forEach(cup => {
			headers.push(competitions[cup].sh);
		});

		return headers;
	}

	getMobileSubView() {
		if (this.state.comp === 'L') {
			if (this.props.data.leagues[0] === undefined) {
				return null;
			}

			return (<LeagueTable league={this.props.data.leagues[0]} team={this.props.team} />);
		} else {
			var cup;

			for (var i = 0; i < this.props.data.cups.length; i++) {
				cup = this.props.data.cups[i];

				if (competitions[cup.name].sh === this.state.comp) {
					return (<Cup team={this.props.team} cup={cup} />);
				}
			}
		}

		return null;
	}

	selectComp(comp) {
		this.setState({ comp: comp });
	}
}
