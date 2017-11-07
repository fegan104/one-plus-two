import React, { Component } from 'react';

import QRCode from 'qrcode.react';

import { connect } from 'react-redux';
import { getInvite } from '../../actions/InvitesActions';

import _ from 'lodash';

class ViewInvite extends Component {
  componentDidMount() {
    this.props.getInvite(this.props.id);
  }

  render() {
    let { invite } = this.props;

    return (
      <div>
        Hello from Invite View
        <br />
        invite id: {invite.id}
        <br />
        for event:{' '}
        <span className="event-title">{_.get(invite, 'event.title')}</span>
        <div>
          This is your pass to the event:
          <QRCode value={this.props.id} size={256} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    invite: state.invite,
    id: ownProps.match.params.id
  };
};

export default connect(mapStateToProps, { getInvite })(ViewInvite);
