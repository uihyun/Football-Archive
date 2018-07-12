import React from 'react';
import { Route, Switch } from 'react-router-dom';

import View from './View';

const Ranking = ({ match }) => (
	<Switch>
		<Route path={`${match.url}/:year`} component={View} />
	</Switch>
);

export default Ranking;
