import React, { Component } from 'react';

import './style.css';

export default class ViewSelector extends Component {
	
	constructor(props) {
		super(props);

		var state = {view: ''};

		if (this.props.views.length > 0) {
			state.view = this.props.views[0].name;
		}

		this.state = state;
		
		this.selectView = this.selectView.bind(this);
	}
	
	componentWillReceiveProps(props) {
		var i, view;
		if (props.views.length > 0) {
			for (i = 0; i < props.views.length; i++) {
				view = props.views[i];

				if (view.name === this.state.view) {
					return;
				}
			}
			
			this.setState({view: props.views[0].name});
		}
	}

	render() {
		return (
			<div className="ViewSelector">
				<div className="ViewSelector text-center flex-container">
					{this.props.views.map(view => {
						var style = {};

						if (view.name === this.state.view) {
							style.fontWeight = 'bold';
						}

						var sh = view.sh ? view.sh : view.name;
				
						return (
							<div key={view.name} style={style} className="flex-1"
								 onClick={() => this.selectView(view.name)}>
								<span className="hide-mobile">{view.name}</span>
								<span className="show-mobile">{sh}</span>
							</div>
						);
					})}
				</div>
				{this.getView()}
			</div>
		);
	}
	
	selectView(view) {
		if (view !== this.state.view) {
			this.setState({view: view});
		}
	}

	getView() {
		var i, view;

		for (i = 0; i < this.props.views.length; i++) {
			view = this.props.views[i];
			if (view.name === this.state.view) {
				return view.view;
			}
		}

		return null;
	}
}

