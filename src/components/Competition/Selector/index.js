import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './style.css';

import { YearSelector } from '../../Common';

import { clubs, competitions } from '../data';

import UrlUtil from '../../../util/url';

import layout from './layout';

export default class CompetitionSelector extends Component {

  render() {
		const year = this.props.match.params.year;
		const domestic = layout.domestic;
		const continental = layout.continental;
		const kleague = layout.kleague;

		const large = {fontSize: '1.5em'};

		return (
			<div className="CompetitionSelector text-center">
				<br/>
				<YearSelector year={year} min={clubs.years.min} max={clubs.years.max} link={'competition'} />
				<br/>
				<div className="flex-container">
					{layout.europe.map(comp => {
						return (
							<div key={comp} className="flex-1" style={large}>
								{this.getCompLink(comp)}
							</div>
						);
					})}
				</div>
				<br/>
				{this.getHeaders(domestic.list, large)}
				{this.getComps(domestic)}
				<br/>
				<div className="flex-container">
					{layout.fifa.map(comp => {
						if (competitions[comp].times === undefined ||
								competitions[comp].times.includes(parseInt(year, 10)) !== true)
							return null;

						return (
							<div key={comp} className="flex-1" style={large}>
								{this.getCompLink(comp)}
							</div>
						);
					})}
				</div>
				<br/>
				{this.getHeaders(continental.list, large)}
				{this.getComps(continental)}
				<br/>
				<div className="flex-container">
					{layout.asia.map(comp => {
						return (
							<div key={comp} className="flex-1" style={large}>
								{this.getCompLink(comp)}
							</div>
						);
					})}
				</div>
				<br/>
				{this.getHeaders(kleague.list, large)}
				{this.getComps(kleague)}
			</div>
		);
	}

	getHeaders(array, style) {
		return (
			<div className="flex-container">
				{array.map(elem => {
					return (
						<div key={elem} className="flex-1" style={style}>
							{elem}
						</div>
					);
				})}
			</div>
		);
	}

	getComps(obj) {
		return obj.legend.map(type => {
			return (
				<div key={type} className="flex-container">
					{obj.list.map(entry => {
						var comp = obj.groups[entry][type];

						return (
							<div key={entry} className="flex-1">
								{this.getCompLink(comp)}
							</div>
						);
					})}
				</div>
			);
		});
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
