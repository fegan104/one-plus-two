import React, { Component } from 'react';
import './App.css';
import Home from './Home/Home.js'
import CreateEvent from './Event/CreateEvent.js'
import EventDetail from './Event/EventDetail.js'
import { Route, Switch } from 'react-router'


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">OnePlusTwo</h1>
        </header>
        <div className="App-intro">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/detail" component={EventDetail} />
              <Route path="/create" component={CreateEvent} />
            </Switch>
        </div>
      </div>
    );
  }
}

export default App;
