import React, { Component } from 'react';
import './App.css';
import Home from './components/Home/Home';
import CreateEvent from './components/Event/CreateEvent';
import EventDetail from './components/Event/EventDetail';
import ViewInvite from './components/Invite/ViewInvite';

import { Route, Switch } from 'react-router';
import { init as firebaseInit } from './services/FirebaseService';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mockSignIn } from './actions/SignInActions';
import thunk from 'redux-thunk';
import reducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';

class App extends Component {
  constructor(props) {
    super(props);

    // Create a history of your choosing (we're using a browser history in this case)
    this.history = createHistory();

    // Build the middleware for intercepting and dispatching navigation actions
    let middleware = applyMiddleware(
      routerMiddleware(this.history),
      logger,
      promise(),
      thunk
    );

    //Finally make a store with reducers and all our middleware
    this.store = createStore(reducers, middleware);
    this.store.dispatch(mockSignIn());

    firebaseInit();
  }

  render() {
    return (
      <Provider store={this.store}>
        <ConnectedRouter history={this.history}>
          <MuiThemeProvider>
            <div className="App">
              <header className="App-header">
                <h1 className="App-title">OnePlusTwo</h1>
              </header>
              <div className="App-intro">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/detail" component={EventDetail} />
                  <Route path="/create" component={CreateEvent} />
                  <Route path="/invite/:id" component={ViewInvite} />
                </Switch>
              </div>
            </div>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
