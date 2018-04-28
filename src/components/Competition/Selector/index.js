import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { YearSelector } from '../../Common';

import { clubs, competitions } from '../data';

import UrlUtil from '../../../util/url';

export default class CompetitionSelector extends Component {

  render() {
		const year = this.props.match.params.year;
		const domestic = competitions.domestic;
		const legend = domestic.legend;
		const countries = clubs.countries;

		return (
			<div className="CompetitionSelector text-center">
				<br/>
				<YearSelector year={year} min={clubs.years.min} max={clubs.years.max} link={'competition'} />
				<br/>
				<div className="flex-container">
					{competitions.europe.map(comp => {
						return (
							<div key={comp} className="flex-1">
								{this.getCompLink(comp)}
							</div>
						);
					})}
				</div>
				<br/>
				<div className="flex-container">
					{countries.map(country => {
						return (
							<div key={country} className="flex-1">
								{country}
							</div>
						);
					})}
				</div>
				{legend.map(type => {
					return (
						<div key={type} className="flex-container">
							{countries.map(country => {
								var comp = domestic.clubs[country][type];

								return (
									<div key={country} className="flex-1">
										{this.getCompLink(comp)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		);
	}

	getCompLink(comp) {
		const year = this.props.match.params.year;
		var link = UrlUtil.getCompLink(year, comp);
		var inner = '';
		
		if (link !== null) {
			inner = (
				<Link to={link}>
					<div className="show-mobile">{competitions[comp].sh}</div>
					<div className="hide-mobile">{competitions[comp].name}</div>
				</Link>
			);
		}

		return inner;
	}
}
