import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';
import { addInvite } from '../../actions/InvitesActions';

import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';
import Dialog from 'material-ui/Dialog';
import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { push } from 'react-router-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';

/**
 * Displays details about teh events specified in the route's id. 
 * Makes a request for the specified event frmo firebase and pulls it fomr the store.
 */
class EventDetail extends React.Component {
  state = {
    shareOpen: false,
    sendOpen: false
  };

  openShare = () => {
    this.setState({ shareOpen: true });
    let { event } = this.props;
    this.props.addInvite(
      {
        event: event.id,
        isUsed: false,
        additionalInvitesLeft: 2
      },
      event.guestLimit
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

  componentDidMount() {
    this.props.getEvent(this.props.id);
  }

  render() {
    let { event, invite } = this.props;
    let view = null;
    if (event) {
      let inviteLink = `https://www.one-plus-two.com/invite/${invite.id}`;
      const shareActions = [
        <FlatButton label="Cancel" primary={true} onClick={this.closeShare} />,
        <CopyToClipboard text={inviteLink}>
          <FlatButton label="Copy" primary={true} onClick={this.closeShare} />
        </CopyToClipboard>
      ];
      const sendActions = [
        <FlatButton label="Cancel" primary={true} onClick={this.closeSend} />,
        <FlatButton label="Send" primary={true} onClick={this.closeSend} />
      ];
      view = (
        <div>
          <EventCard
            event={event}
            openInvite={this.openShare}
            openSend={this.openSend}
          />

          <Dialog
            title="Your invite link"
            actions={shareActions}
            modal={false}
            open={this.state.shareOpen}
            onRequestClose={this.closeShare}
          >
            {inviteLink}
          </Dialog>

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
  return {
    event,
    invite: state.invite,
    id: eventId
  };
};

export default connect(mapStateToProps, { getEvent, push, addInvite })(
  EventDetail
);
