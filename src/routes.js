import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import Club from './components/Club';
import Nation from './components/Nation';
import Competition from './components/Competition';
import Versus from './components/Versus';
import OneMatch from './components/OneMatch';
import Manage from './components/Manage';

const Routes = (props) => (
	<BrowserRouter>
		<div>
			<div className="text-center header"><Link to="/">Football Archiv</Link><Link to="/manage">e</Link></div>
			<Route exact path="/" component={Home} />
			<Route path="/club" component={Club} />
			<Route path="/nation" component={Nation} />
			<Route path="/competition" component={Competition} />
			<Route path="/versus/:teamA/:teamB" component={Versus} />
			<Route path="/match/:url" component={OneMatch} />
			<Route path="/manage" component={Manage} />
		</div>
	</BrowserRouter>
);

export default Routes;
