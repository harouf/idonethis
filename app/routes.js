import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import {
  App,
  NotFound
} from 'containers';

export default (store) => {
  const history = syncHistoryWithStore(browserHistory, store);

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Router history={history}>
      <Route path="/" component={App} />
      <Route path="*" component={NotFound} status={404} />
    </Router>
  );
};
