import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Nav from './components/Nav';
import PLTeams from './components/PLTeams';
import PlayerStatsHeader from './components/PlayerStatsHeader';
import Manage from './components/Manage';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Nav}>
			<IndexRoute component={PLTeams} />
			<Route path="pl-teams" component={PLTeams} />
			<Route path="player-stats" component={PlayerStatsHeader} />
			<Route path="manage" component={Manage} />
		</Route>
  </Router>
);

export default Routes;
