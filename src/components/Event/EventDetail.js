import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';
import queryString from 'query-string';

import { getEvent } from '../../actions/EventsActions';
import { addInvite, getInvite } from '../../actions/InvitesActions';
import { claimInvite } from '../../actions/PassActions';

// import _ from 'lodash';
import QRCode from 'qrcode.react';

import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';
import Dialog from 'material-ui/Dialog';
import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { push } from 'react-router-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/**
 * Displays details about the events specified in the route's id. 
 * Makes a request for the specified event frmo firebase and pulls it fomr the store.
 */
class EventDetail extends React.Component {
  //store just a little state to open 2 dialogs
  state = {
    shareOpen: false,
    sendOpen: false,
    passOpen: false
  };

  /**
   * Open share dialog and generate an invitation link.
   */
  openShare = () => {
    this.setState({ shareOpen: true });
    let { event, user } = this.props;
    this.props.addInvite(
      {
        event: event.id,
        isUsed: false
      },
      event,
      user.id
    );
  };

  closeShare = () => {
    this.setState({ shareOpen: false });
  };

  openSend = () => {
    this.setState({ sendOpen: true });
  };

  closeSend = () => {
    this.setState({ sendOpen: false });
  };

  openPass = () => {
    this.setState({ passOpen: true });
  };

  closePass = () => {
    this.setState({ passOpen: false });
  };

  componentDidMount() {
    this.props.getEvent(this.props.eventId);
    this.props.getInvite(this.props.inviteId);
  }

  // renderQRCode = pass => {
  //   if (!_.isEmpty(pass)) {
  //     let actions = [
  //       <FlatButton label="Cancel" primary={true} onClick={this.closePass} />
  //     ];
  //     return (
  //       <Dialog
  //         title="This is your pass to the event:"
  //         actions={actions}
  //         modal={false}
  //         open={this.state.passOpen}
  //         onRequestClose={this.closePass}
  //       >
  //         <QRCode value={pass.id} size={256} />
  //       </Dialog>
  //     );
  //   }
  //   return <div />;
  // };

  render() {
    let { event, inviteLink, user, invite, pass } = this.props;
    let view = null;
    if (event) {
      const shareActions = [
        <FlatButton label="Close" primary={true} onClick={this.closeShare} />,
        <CopyToClipboard text={inviteLink}>
          <FlatButton label="Copy" primary={true} onClick={this.closeShare} />
        </CopyToClipboard>
      ];
      const sendActions = [
        <FlatButton label="Cancel" primary={true} onClick={this.closeSend} />,
        <FlatButton label="Send" primary={true} onClick={this.closeSend} />
      ];
      const showPassActions = [
        <FlatButton label="Cancel" primary={true} onClick={this.closePass} />
      ];
      view = (
        <div>
          {/* The event info card */}
          <EventCard
            event={event}
            openInvite={this.openShare}
            openSend={this.openSend}
            showPass={_ => {
              this.openPass();
              this.props.claimInvite(invite, user);
            }}
          />

          {/* invite share dialog */}
          <Dialog
            title="Your invite link"
            actions={shareActions}
            modal={false}
            open={this.state.shareOpen}
            onRequestClose={this.closeShare}
          >
            {inviteLink}
          </Dialog>

          {/* Messaging dialog */}
          <Dialog
            title="Compose message"
            actions={sendActions}
            modal={false}
            open={this.state.sendOpen}
            onRequestClose={this.closeSend}
          >
            <TextField
              name="message-field"
              label="Message Text"
              multiLine={true}
            />
          </Dialog>

          {/* {this.renderQRCode(pass)} */}
          {/* Pass dialog */}
          <Dialog
            title="This is your pass to the event:"
            actions={showPassActions}
            modal={false}
            open={this.state.passOpen}
            onRequestClose={this.closePass}
          >
            <QRCode value={pass.id} size={256} />
          </Dialog>

          <Fab
            className="fab"
            secondary={true}
            onClick={_ => this.props.push('/scanner')}
          >
            <CropFree style={{ fill: '#000' }} />
          </Fab>
        </div>
      );
    } else {
      view = <h1>loading...</h1>;
    }

    return <div className="EventDetail">{view}</div>;
  }
}

/**
 * This function filters the redux store's evnts to find the
 * specific event to display on this page.
 * @param state The redux store.
 * @param ownProps The rect components props.
 * @returns an event model with the specified id and an id specified in the route.
 */
const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;
  const filtered = state.events.filter(e => e.id === eventId);
  const event = filtered[0];
  console.log('auth:', state.auth);
  return {
    event,
    inviteLink: state.inviteLink,
    invite: state.invite,
    inviteId: queryString.parse(ownProps.location.search).invite,
    eventId,
    user: state.auth.userObject,
    pass: state.pass
  };
};

export default connect(mapStateToProps, {
  getEvent,
  push,
  addInvite,
  getInvite,
  claimInvite
})(EventDetail);
