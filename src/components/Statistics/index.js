import React, { Component } from 'react';

import './style.css';

import { PageSelector } from '../Common';

import Appearances from './appearances';
import Goals from './goals';
import Assists from './assists';

import SquadUtil from '../../util/squad';

export default class Statistics extends Component {

  render() {
		const stats = SquadUtil.getStatistics(this.props.data.data, this.props.data.team);
		const views = [
			{ name: 'Appearances', sh: 'App', link: '/app', component: Appearances, data: stats.appearances },
			{ name: 'Goals', sh: 'Goal', link: '/goal', component: Goals, data: stats.goals },
			{ name: 'Assists', sh: 'Ass', link: '/assist', component: Assists, data: stats.assists },
		];
		
    return (
      <div className="Statistics">
				<PageSelector views={views} expand={true} basename={this.props.basename} />
      </div>
    );
  }
}
