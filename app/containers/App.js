import React, {Component} from 'react';
import Dock from 'react-dock';

import {MainContent} from '../components';

export default class App extends Component {
	constructor(props) {
		super(props);
	}

  render() {
  	return (
      <div className="app-container">
				<MainContent />
      </div>
    );
  }
}
