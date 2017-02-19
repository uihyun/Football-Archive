import React from 'react';
import { Router, Route } from 'react-router';

import Season from './components/Season';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={Season} />
    <Route path="*" component={Season} />
  </Router>
);

export default Routes;
