import React from 'react';
import { Route } from 'react-router-dom';

import View from './View';
import Selector from './Selector';

const Club = ({ match }) => (
	<div>
		<Route path={`${match.url}/:year/:team`} component={View} />
		<Route exact path={`${match.url}`} component={Selector} />
	</div>
);

export default Club;
