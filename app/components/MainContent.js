import React, {Component} from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

@connect(
  state => ({  }),
  {  }
) 
export default class MainContent extends Component {
	constructor(props) {
		super(props);
  }

  render() {
  	return (
  		<div className="app-content">
  			<h1>React-based iDoneThis Application.</h1>
  		</div>
  	);
  }
}
