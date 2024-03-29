import React, { Component } from 'react';
import Home from './components/Home/Home';
import CreateEvent from './components/Event/CreateEvent';
import EventList from './components/Event/EventList';
import EventDetail from './components/Event/EventDetail';
import NotFound from './components/NotFound.js';
import InviteForEvent from './components/Event/InviteForEvent';
import Scanner from './components/Scanner/Scanner';

import Header from './components/Header/Header';

import { Route, Switch } from 'react-router';
import { init as firebaseInit } from './services/FirebaseService';
import UserModel from './models/UserModel';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { authStateChange, refreshToken } from './actions/AuthActions';
import thunk from 'redux-thunk';
import reducers from './reducers';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import logger from 'redux-logger';
import promise from 'redux-promise-middleware';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#222',
    accent1Color: '#00e676'
  },
  datePicker: {
    headerColor: '#222',
    selectColor: '#00e676'
  },
  timePicker: {
    headerColor: '#222'
  }
});

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

    this.store = createStore(reducers, middleware);

    firebaseInit(user => {
      if (user) {
        let userObj = UserModel({ ...user });
        this.store.dispatch(authStateChange(userObj));
        this.store.dispatch(refreshToken(userObj));
      }
    });
  }

  //Wrap the application in a Provider so all our container components can access the redux store.
  //Wrap in connected router so we can dispatch routing events
  //Wrap in MuiThemProvider so our view components have MD styling
  render() {
    return (
      <Provider store={this.store}>
        <ConnectedRouter history={this.history}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div className="App">
              <div className="App-intro">
                <Header />

                <div style={{ paddingTop: '64px' }}>
                  <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/events/new" component={CreateEvent} />
                    <Route path="/events" component={EventList} />
                    <Route path="/event/:id/scanner" component={Scanner} />
                    <Route path="/event/:id" component={EventDetail} />
                    <Route path="/invite/:id" component={InviteForEvent} />
                    <Route path="*" component={NotFound} />
                  </Switch>
                </div>
              </div>
            </div>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
