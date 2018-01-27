import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import { sendMessage } from '../../actions/EventsActions';

const style = {
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

class SendMessageDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageText: ''
    };
  }

  handleMessage = event => {
    this.setState({ messageText: event.target.value });
  };

  render() {
    let actions = [
      <div>
        <FlatButton
          label="Send"
          primary={true}
          onClick={_ => {
            this.props.sendMessage(this.props.event.id, this.state.messageText);
            this.props.onClose();
          }}
        />
        <FlatButton
          label="Cancel"
          onClick={_ => {
            this.props.onClose();
          }}
        />
      </div>
    ];

    let content = (
      <TextField
        name="message-field"
        label="Message Text"
        multiLine={true}
        fullWidth={true}
        value={this.state.messageText}
        onChange={this.handleMessage}
      />
    );

    return (
      <Dialog
        title="Send this link to a friend"
        actions={actions}
        modal={true}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        <div style={style.buttonWrapper}>{content}</div>
      </Dialog>
    );
  }
}

SendMessageDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  event: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, { sendMessage })(SendMessageDialog);
