import React, { Component } from 'react';

import './style.css';

import { Ranking } from '../../Common';

export default class LeagueViewGoal extends Component {

  render() {
    return <Ranking goals={this.props.data.goals} year={this.props.data.year} />;
  }
}
