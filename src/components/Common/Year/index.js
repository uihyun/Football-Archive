import React, { Component } from 'react';

export default class YearSelector extends Component {

	render() {
		return this.getSeasonSpan(this.props.year);
	}
	
	formatShortYear(year) {
		year %= 100;
		if (year === 0) {
			return '00';
		} else if (year < 10) {
			return '0' + year;
		}

		return year;
	}

	getSeasonSpan(year) {
		var a = year - 1;
		var b = year;

		if (this.props.fullyear) {
			return <span>{year}</span>;
		}

		return (
			<span>
				<span className="hide-mobile">{a}-{b}</span>
				<span className="show-mobile">{this.formatShortYear(a)}{this.formatShortYear(b)}</span>
			</span>
		);
	}
}
