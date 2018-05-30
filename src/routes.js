import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';

import Home from './components/Home';
import FIFA from './components/FIFA';
import UEFA from './components/UEFA';
import AFC from './components/AFC';
import Competition from './components/Competition';
import Versus from './components/Versus';
import OneMatch from './components/OneMatch';
import History from './components/History';
import Manage from './components/Manage';

const Routes = (props) => (
	<BrowserRouter>
		<div>
			<div className="text-center header"><Link to="/">Football Archiv</Link><Link to="/manage">e</Link></div>
			<Route exact path="/" component={Home} />
			<Route path="/FIFA" component={FIFA} />
			<Route path="/UEFA" component={UEFA} />
			<Route path="/AFC" component={AFC} />
			<Route path="/competition" component={Competition} />
			<Route path="/versus/:teamA/:teamB" component={Versus} />
			<Route path="/match/:url" component={OneMatch} />
			<Route path="/history" component={History} />
			<Route path="/manage" component={Manage} />
		</div>
	</BrowserRouter>
);

export default Routes;
