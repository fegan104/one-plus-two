import React, { Component } from 'react';
import './Home.css';
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
          {/* <img src={logo} alt="logo" /> */}
          <div className="Home-title circle">
            <div>One</div>
            <div>Plus</div>
            <div>Two</div>
          </div>
        </div>

        <div className="Home-button-wrapper">
          <div className="Home-button-container">
            <div>
              <Link to="/events/new">
                <RaisedButton
                  backgroundColor="#fff"
                  className="Home-button"
                  label="Host an event"
                />
              </Link>
            </div>

            <div>
              <Link to="/events">
                <RaisedButton
                  backgroundColor="#fff"
                  labelColor="#000"
                  className="Home-button"
                  label="Show My Events"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

//Connect makes dispatch() avalable though props
export default connect(mapStateToProps, { setHeader })(Home);
