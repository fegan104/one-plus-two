import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Loader from '../Common/Loader';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { generateNewInvite } from '../../actions/InvitesActions';

class InviteMorePeopleDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: false
    };
  }

  handleGenerateNewInvite = () => {
    this.props.generateNewInvite(this.props.event.id);
    this.setState({ clicked: true });
  };

  render() {
    let actions = [
      <div>
        <CopyToClipboard text={this.props.inviteLink}>
          <FlatButton
            label="Copy"
            primary={true}
            disabled={!!!this.props.inviteLink}
          />
        </CopyToClipboard>
        <FlatButton label="Cancel" onClick={this.props.onClose} />
      </div>
    ];

    let content = (
      <RaisedButton
        label="Generate New Invite"
        primary={true}
        onClick={this.handleGenerateNewInvite}
      />
    );

    if (this.props.inviteLink) {
      content = (
        <a href={this.props.inviteLink} target="_blank">
          {this.props.inviteLink}
        </a>
      );
    } else if (this.state.clicked) {
      content = <Loader />;
    }

    return (
      <Dialog
        title="Send this link to a friend"
        actions={actions}
        modal={true}
        open={this.props.show}
        onRequestClose={this.props.onClose}
      >
        {content}
      </Dialog>
    );
  }
}

InviteMorePeopleDialog.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  event: PropTypes.object
};

const mapStateToProps = (state, ownProps) => {
  return {
    inviteLink: state.inviteLink
  };
};

export default connect(mapStateToProps, { generateNewInvite })(
  InviteMorePeopleDialog
);
