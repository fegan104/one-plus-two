import React, { Component } from 'react';
import './App.css';
import Home from './components/Home/Home.js';
import CreateEvent from './components/Event/CreateEvent.js';
import EventDetail from './components/Event/EventDetail.js';
import { Route, Switch } from 'react-router';
import { init as firebaseInit } from './services/FirebaseService';

class App extends Component {
  constructor(props) {
    super(props);
    firebaseInit();
  }

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
