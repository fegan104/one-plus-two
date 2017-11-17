import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import LoginDialog from '../Dialogs/LoginDialog';

import { signOut } from '../../actions/AuthActions';

const Logged = props => (
  <IconMenu
    iconButtonElement={
      <IconButton>
        <MoreVertIcon color="#fff" />
      </IconButton>
    }
    targetOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
  >
    <MenuItem primaryText="Sign out" onClick={props.signOut} />
  </IconMenu>
);

Logged.muiName = 'IconMenu';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginModal: false
    };
  }

  handleLogin = () => {
    this.setState({ showLoginModal: true });
  };

  handleCloseLoginModal = () => {
    this.setState({ showLoginModal: false });
  };

  render() {
    let rightButton = this.props.loggedIn ? (
      <Logged signOut={this.props.signOut} />
    ) : (
      <FlatButton label="Login" onClick={this.handleLogin} />
    );

    return (
      <div>
        <LoginDialog
          show={this.state.showLoginModal}
          onClose={this.handleCloseLoginModal}
        />
        <AppBar
          title="OnePlusTwo"
          iconElementRight={rightButton}
          iconElementLeft={<div />}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.auth.loggedIn
  };
};

export default connect(mapStateToProps, { signOut })(Header);
