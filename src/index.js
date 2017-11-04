import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = applyMiddleware(
  routerMiddleware(history),
  logger,
  promise(),
  thunk
);

//Finally make a store with reducers and all our middleware
const store = createStore(reducers, middleware);

//Wrap the application in a Provider so all our container components can access the redux store.
//Wrap in connected router so we can dispatch routing events
//Wrap in MuiThemProvider so our view components have MD styling
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
