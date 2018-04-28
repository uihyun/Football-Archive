import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { clubs, competitions } from '../data';

import UrlUtil from '../../util/url';

export default class CompetitionSelector extends Component {

  render() {
		const domestic = competitions.domestic;
		const legend = domestic.legend;
		const countries = clubs.countries;

		return (
			<div className="CompetitionSelector text-center">
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
		var link = UrlUtil.getCompLink(2018, comp);
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
