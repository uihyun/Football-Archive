import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

export default class YearSelector extends Component {

	render() {
		return (
			<div className="flex-container flex-container-center">
				<div className="ClubSelector-flex-container-year">
					{this.getYears(this.props.year)}
				</div>
			</div>
		);
	}

	getYears(year) {
		var years = [];
		var i, style = 'ClubSelector-year';

		for (i = this.props.min; i <= this.props.max; i++) {
			if (i === parseInt(year, 10)) {
				years.push((
					<div key={i} className={style + " ClubSelector-year-selected"}>
						{i}
					</div>
				));
			} else {
				years.push((
					<div key={i} className={style}>
						<Link to={'/' + this.props.link + '/' + i}>{i}</Link>
					</div>
				));
			}
		}

		return years;
	}
}
