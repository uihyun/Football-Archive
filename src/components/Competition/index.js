import React from 'react';
import { Route } from 'react-router-dom';

import View from './View';
import Selector from './Selector';

const Competition = ({ match }) => (
	<div>
		<Route path={`${match.url}/:year/:comp`} component={View} />
		<Route exact path={`${match.url}/:year`} component={Selector} />
	</div>
);

export default Competition;
