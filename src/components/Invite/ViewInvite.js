import React, { Component } from 'react';

import QRCode from 'qrcode.react';
import RaisedButton from 'material-ui/RaisedButton';

import { connect } from 'react-redux';
import { getInvite } from '../../actions/InvitesActions';
import { addPass } from '../../actions/PassActions';

import PassModel from '../../models/PassModel';

import _ from 'lodash';

/**
 * Lets a guest see their invitation to an event. If the invitation has already been 
 * redeemed for a pass then the pass will be displayed (TODO). Otherwise it will 
 * prompt the user to 'get a pass'.
 */
class ViewInvite extends Component {
  componentDidMount() {
    this.props.getInvite(this.props.id);
  }

  renderQRCode = pass => {
    if (pass) {
      return (
        <div>
          This is your pass to the event:
          <QRCode value={pass.id} size={256} />
        </div>
      );
    }
    return <div />;
  };

  render() {
    let { invite, pass, user } = this.props;

    return (
      <div>
        Hello from Invite View
        <br />
        invite id: {invite.id}
        <br />
        for event:{' '}
        <span className="event-title">{_.get(invite, 'event.title')}</span>
        <br />
        <RaisedButton
          label="Get a Pass"
          onClick={_ =>
            this.props.addPass(
              PassModel({
                desc: invite.event.desc,
                isActive: false,
                isUsed: false,
                user: user.id,
                event: invite.event.id
              })
            )}
        />
        {this.renderQRCode(pass)}
      </div>
    );
  }
}

//ensures that the pass we have for this screen is for the same event as the invite
const mapStateToProps = (state, ownProps) => {
  const eventId = state.invite.event && state.invite.event.id;
  const filtered = state.passes.filter(p => p.event === eventId);
  const pass = filtered[0] && filtered[0];
  return {
    invite: state.invite,
    pass,
    id: ownProps.match.params.id,
    user: state.user
  };
};

export default connect(mapStateToProps, { getInvite, addPass })(ViewInvite);
