import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent, sendMessage } from '../../actions/EventsActions';
import { getInvite, clearInvite } from '../../actions/InvitesActions';
import { setHeader } from '../../actions/HeaderActions';
import { loadPass, monitorPass } from '../../actions/PassActions';

import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';

import Dialog from 'material-ui/Dialog';
import ShowPassDialog from '../Dialogs/ShowPassDialog';
import InviteMorePeopleDialog from '../Dialogs/InviteMorePeopleDialog';
import EventMessages from './EventMessages';

import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { push } from 'react-router-redux';

import Loader from '../Common/Loader';

/**
 * Displays details about the events specified in the route's id.
 * Makes a request for the specified event frmo firebase and pulls it fomr the store.
 */
class EventDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shareOpen: false,
      sendOpen: false,
      passOpen: false,
      messageText: ''
    };
  }

  openShare = () => {
    this.setState({ shareOpen: true });
  };

  closeShare = () => {
    this.setState({ shareOpen: false });
    this.props.clearInvite();
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

  handleMessage = event => {
    this.setState({ messageText: event.target.value });
  };

  componentDidMount() {
    const { eventId } = this.props;
    this.props.getEvent(eventId);

    this.configureAppHeader();
  }

  componentWillReceiveProps(nextProps) {
    let { event, user } = nextProps;

    if (event) {
      this.configureAppHeader(nextProps);
    } else {
      return;
    }

    if (
      user &&
      user.events &&
      !this.props.invite &&
      user.events[event.id] &&
      user.events[event.id].invite
    ) {
      this.props.getInvite(user.events[event.id].invite);
    }
    if (
      user &&
      user.events &&
      !this.props.pass &&
      user.events[event.id] &&
      user.events[event.id].pass
    ) {
      this.props.loadPass(user.events[event.id].pass);
    }

    if (this.props.pass) {
      console.log('qqq', this.props.pass, this.props.pass.id);
      this.props.monitorPass(this.props.pass.id);
    }
  }

  configureAppHeader = (nextProps = this.props) => {
    let { event } = nextProps;

    this.props.setHeader({
      pageTitle: event && event.title,
      headerTitle: event && event.title,
      backButton: '/events'
    });
  };

  render() {
    let { event, pass, user, invite } = this.props;

    if (!event || !user || user.events === null) {
      return <Loader />;
    }

    let isOwner =
      (user.events &&
        user.events[event.id] &&
        user.events[event.id].isOwner === true) ||
      event.owners[user.id];
    let canInviteMore =
      (event.spotsLeft === null || event.spotsLeft > 0) &&
      (isOwner || (invite && invite.additionalInvitesLeft > 0));

    const sendActions = [
      <FlatButton label="Cancel" primary={true} onClick={this.closeSend} />,
      <FlatButton
        label="Send"
        primary={true}
        onClick={_ => {
          this.props.sendMessage(event.id, this.state.messageText);
          this.closeSend();
        }}
      />
    ];

    const scanButton = (
      <Fab
        className="fab"
        secondary={true}
        onClick={_ => this.props.push(`/event/${event.id}/scanner`)}
      >
        <CropFree style={{ fill: '#000' }} />
      </Fab>
    );

    return (
      <div className="EventDetail">
        <EventCard event={event}>
          {isOwner ? (
            <FlatButton label="Send Message" onClick={this.openSend} />
          ) : null}
          {canInviteMore ? (
            <FlatButton label="Invite Guests" onClick={this.openShare} />
          ) : (
            <FlatButton label="Cannot Invite More Guests" disabled={true} />
          )}
          {pass ? (
            <FlatButton label="Show Pass" onClick={this.openPass} />
          ) : null}
        </EventCard>

        {canInviteMore ? (
          <InviteMorePeopleDialog
            event={event}
            show={this.state.shareOpen}
            onClose={this.closeShare}
          />
        ) : null}

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
            fullWidth={true}
            value={this.state.messageText}
            onChange={this.handleMessage}
          />
        </Dialog>

        {pass ? (
          <ShowPassDialog
            pass={pass}
            show={this.state.passOpen}
            onClose={this.closePass}
          />
        ) : null}

        <h3 className="feed-header">News Feed:</h3>
        <EventMessages newsFeed={event.newsFeed} />

        {isOwner ? scanButton : null}
      </div>
    );
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
    eventId,
    user: state.auth.userObject,
    pass: state.pass,
    invite: state.invite //TODO this is sometimes in the userData but not in the invite store
  };
};

export default connect(mapStateToProps, {
  getEvent,
  push,
  getInvite,
  setHeader,
  sendMessage,
  loadPass,
  monitorPass,
  clearInvite
})(EventDetail);
