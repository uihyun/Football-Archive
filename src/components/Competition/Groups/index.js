import React, { Component } from 'react';

import './style.css';

import { PageSelector } from '../../Common';

import Group from './group';
	
export default class Groups extends Component {
	
	render() {
		return (
			<PageSelector views={this.getViews()} basename={this.props.basename}/>
		);
	}

	getViews() {
		const groups = this.props.groups;
		var i, group, code;
		var views = [];

		for (i = 0; i < groups.length; i++) {
			group = groups[i];
			code = group.name.replace(/Group /, '');

			views.push({
				name: code,
				link: '/' + code,
				component: Group,
				data: { group: group, comp: this.props.comp }
			});
		}

		return views;
	}
}
