import React, { Component } from 'react';

import './style.css';

import { PageSelector } from '../Common';

import Appearances from './appearances';
import Goals from './goals';
import Assists from './assists';

import SquadUtil from '../../util/squad';

export default class Statistics extends Component {

	constructor(props) {
		super(props);
		
		this.state = this.newState(this.props.data.data, this.props.data.team);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState(this.newState(nextProps.data, nextProps.team));
	}

  render() {
		const views = [
			{ name: 'Appearances', sh: 'App', link: '/app', component: Appearances, data: this.state.appearances },
			{ name: 'Goals', sh: 'Goal', link: '/goal', component: Goals, data: this.state.goals },
			{ name: 'Assists', sh: 'Ass', link: '/assist', component: Assists, data: this.state.assists },
		];

    return (
      <div className="Statistics">
				<PageSelector views={views} expand={true} basename={this.props.basename} />
      </div>
    );
  }

	newState(data, team) {
		return SquadUtil.getStatistics(data, team);
	}
}
