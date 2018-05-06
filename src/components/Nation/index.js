import React from 'react';
import { Route, Switch } from 'react-router-dom';

import History from '../History/Team';
import View from './View';
import Selector from './Selector';

const Club = ({ match }) => (
	<Switch>
		<Route path={`${match.url}/history/:team`} component={History} />
		<Route path={`${match.url}/:year/:team`} component={View} />
		<Route path={`${match.url}`} component={Selector} />
	</Switch>
);

export default Club;
