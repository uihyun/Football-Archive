import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import Nav from './components/Nav';
import Season from './components/Season';
import Manage from './components/Manage';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Nav}>
			<IndexRoute component={Season} />
			<Route path="season" component={Season} />
			<Route path="manage" component={Manage} />
		</Route>
  </Router>
);

export default Routes;
