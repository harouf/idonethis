import React from 'react';
import {render} from 'react-dom';
import configureStore from './redux/configStore';
import getRoutes from './routes';
import {Provider} from 'react-redux';

require('./styles/main.scss');

const store = configureStore();
let debug = null;

if (__DEVTOOLS__ && !window.devToolsExtension) {
  const DevTools = require('./containers/DevTools');
  debug = (
    <DevTools />
  );
}

render(
  <Provider store={store} key="provider">
    <div>
      {getRoutes(store)}
      {debug}
    </div>
  </Provider>,
  document.getElementById('container')
);
