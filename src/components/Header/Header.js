import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import BackIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import LoginDialog from '../Dialogs/LoginDialog';

import {
  signOut,
  showLoginModal,
  hideLoginModal
} from '../../actions/AuthActions';

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
  componentDidMount = () => {
    this.updateDocumentTitle();
  };

  componentDidUpdate = () => {
    this.updateDocumentTitle();
  };

  updateDocumentTitle = () => {
    let { pageTitle } = this.props.header;

    document.title = pageTitle;
  };

  handleLogin = () => {
    this.props.showLoginModal();
  };

  handleCloseLoginModal = () => {
    this.props.hideLoginModal();
  };

  render() {
    let { headerTitle, backButton } = this.props.header;
    let { isModalOpened } = this.props;

    let rightButton = this.props.loggedIn ? (
      <Logged signOut={this.props.signOut} />
    ) : (
      <FlatButton label="Login" onClick={this.handleLogin} />
    );

    let leftButton = backButton ? (
      <IconButton>
        <Link to={backButton}>
          <ArrowBack color="#fff" />
        </Link>
      </IconButton>
    ) : (
      <IconButton>
        <div />
      </IconButton>
    );

    return (
      <div>
        <LoginDialog
          show={isModalOpened}
          onClose={this.handleCloseLoginModal}
        />
        <AppBar
          title={headerTitle}
          iconElementRight={rightButton}
          iconElementLeft={leftButton}
        />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.auth.loggedIn,
    header: state.header,
    isModalOpened: state.auth.showLoginModal
  };
};

export default connect(mapStateToProps, {
  signOut,
  showLoginModal,
  hideLoginModal
})(Header);
