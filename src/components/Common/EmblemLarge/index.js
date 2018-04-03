import React, { Component } from 'react';

import './style.css';

import UrlUtil from '../../../util/url';

export default class EmblemLarge extends Component {

	render () {
		return (
			<img src={UrlUtil.getEmblemUrl(this.props.team)} className="EmblemLarge" alt="" />
		);
	}
}
