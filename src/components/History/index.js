import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Team from './Team';

const Club = ({ match }) => (
	<Switch>
		<Route path={`${match.url}/team/:team`} component={Team} />
	</Switch>
);

export default Club;
