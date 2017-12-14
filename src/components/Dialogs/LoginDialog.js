import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import constants from '../../constants';
import { login as loginAction } from '../../actions/AuthActions';

const style = {
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInButton: {
    marginBottom: '4px'
  }
};

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
        <div style={style.buttonWrapper}>
          <RaisedButton
            style={style.signInButton}
            label="Login via Facebook"
            backgroundColor="#3B5998"
            labelColor="#fff"
            onClick={this.loginViaFb}
          />
          <RaisedButton
            style={style.signInButton}
            label="Login via Google"
            backgroundColor="#4885ed"
            labelColor="#fff"
            onClick={this.loginViaGoogle}
          />
        </div>
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
