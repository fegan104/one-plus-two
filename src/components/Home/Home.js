import React, { Component } from 'react';
import './Home.css';
import logo from './logo.svg';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setHeader } from '../../actions/HeaderActions';

/**
 * This is the container component for the home screen.
 */
class Home extends Component {
  componentDidMount() {
    this.configureAppHeader();
  }

  componentDidUpdate() {
    this.configureAppHeader();
  }

  configureAppHeader = () => {
    this.props.setHeader({});
  };

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

        <Link to="/create">
          <RaisedButton
            className="Home-button"
            label="Host an event"
            primary={true}
          />
        </Link>
        <br />
        <Link to="/list">All Events</Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

//Connect makes dispatch() avalable though props
export default connect(mapStateToProps, { setHeader })(Home);
