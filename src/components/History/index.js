import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Team from './Team';
import Competition from './Competition';

const Club = ({ match }) => (
	<Switch>
		<Route path={`${match.url}/team/:team`} component={Team} />
		<Route path={`${match.url}/competition/:comp`} component={Competition} />
	</Switch>
);

export default Club;
