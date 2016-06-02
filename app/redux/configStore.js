import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from './middlewares/promiseMiddleware';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { devTools, persistState } from 'redux-devtools';

import reducers from './reducers';

const routerHistoryMiddleware = routerMiddleware(browserHistory);

let createStoreWithMiddleware = {}
if (__DEVELOPMENT__ && __DEVTOOLS__) {
	const DevTools = require('../containers/DevTools');
  createStoreWithMiddleware = compose(
    applyMiddleware(thunkMiddleware, promiseMiddleware, routerHistoryMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
  )(createStore);
} else {
  createStoreWithMiddleware = applyMiddleware(thunkMiddleware, promiseMiddleware, routerHistoryMiddleware)(createStore);
}

export default (initialState={}) => {
	return createStoreWithMiddleware(reducers, initialState);
}
