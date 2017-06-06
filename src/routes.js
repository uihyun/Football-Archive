import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Nav from './components/Nav';
import Timeline from './components/Timeline';
import SeasonView from './components/SeasonView';
import PlayerStatsHeader from './components/PlayerStatsHeader';
import Manage from './components/Manage';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Nav}>
			<IndexRoute component={Timeline} />
			<Route path="timeline" component={Timeline} />
			<Route path="season-view" component={SeasonView} />
			<Route path="player-stats" component={PlayerStatsHeader} />
			<Route path="manage" component={Manage} />
		</Route>
  </Router>
);

export default Routes;
