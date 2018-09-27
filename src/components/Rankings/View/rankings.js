import React, { Component } from 'react';

import './style.css';

import { Ranking } from '../../Common';

export default class RankingsViewRankings extends Component {

	render() {
		const data = this.props.data;
		const code = data.code;
		return (
			<div>
				<h3 className="hide-mobile text-center">{code}</h3>
				<Ranking goals={data.goals} year={data.year} onlyLeague={code === 'FIFA'} />
			</div>
		);
	}
}
