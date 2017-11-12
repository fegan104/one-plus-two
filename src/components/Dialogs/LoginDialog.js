import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import constants from '../../constants';
import { login as loginAction } from '../../actions/UserActions';

class LoginDialog extends Component {
  loginViaFb = () => {
    this.props.loginAction(constants.FB_AUTH);
  };

  loginViaGoogle = () => {
    this.props.loginAction(constants.GOOGLE_AUTH);
  };

  render() {
    let actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.props.onClose} />
    ];

    return (
      <Dialog
        title="Login"
        actions={actions}
        modal={false}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        <RaisedButton
          label="Login via Facebook"
          primary={true}
          onClick={this.loginViaFb}
        />
        <RaisedButton
          label="Login via Google"
          primary={true}
          onClick={this.loginViaGoogle}
        />
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, { loginAction })(LoginDialog);
