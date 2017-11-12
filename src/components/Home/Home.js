import React, { Component } from 'react';
import './Home.css';
import logo from './logo.svg';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

/**
 * This is the container component for the home screen.
 */
class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div className="Home-title-conatiner">
          <img src={logo} alt="logo" />
          <div className="Home-title">
            <div>One</div>
            <div>Plus</div>
            <div>Two</div>
          </div>
        </div>

        <RaisedButton
          className="Home-button"
          label="Host an event"
          primary={true}
          onClick={_ => this.props.dispatch(push('/create'))}
        />
        <Link to="/create" className="Home-link">
          I have an account
        </Link>
        <Link to="/invite/inviteId1" className="jest-link-0">
          check out invite
        </Link>
        <Link to="/event/eventId1" className="jest-link-1">
          check out event
        </Link>
      </div>
    );
  }
}

//Connect makes dispatch() avalable though props
export default connect()(Home);
