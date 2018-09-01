import React, { Component } from 'react';

import MatchEvent from './MatchEvent';

export default class OneMatchEvents extends Component {

	render() {
		const events = this.props.data;

		return events.map((e, index) =>
			<MatchEvent key={index + e.minute} minute={e.minute} side={e.side}
									goal={e.goal} card={e.card} sub={e.sub} />
		);
	}
}
