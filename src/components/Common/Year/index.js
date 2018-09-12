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

		if (this.props.span) {
			const span = this.props.span;
			var spanMax = 1000;
			var spanMin = 3000;
			var i;

			for (i = 0; i < span.spans.length; i++) {
				if (span.spans[i] >= year) {
					spanMax = span.spans[i];
					spanMin = i > 0 ? span.spans[i-1] + 1 : 1000;
					break;
				}
			}

			var yearMax = 1000;
			var yearMin = 3000;

			for (i = 0; i < span.times.length; i++) {
				if (span.times[i] >= spanMin && span.times[i] <= spanMax) {
					yearMax = Math.max(span.times[i], yearMax);
					yearMin = Math.min(span.times[i], yearMin);
				}
			}

			a = yearMin;
			b = yearMax;

			if (a === b)
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
