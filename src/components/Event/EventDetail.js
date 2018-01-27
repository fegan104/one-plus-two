import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';
import { getInvite, clearInvite } from '../../actions/InvitesActions';
import { setHeader } from '../../actions/HeaderActions';
import { loadPass, monitorPass } from '../../actions/PassActions';

import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';

import ShowPassDialog from '../Dialogs/ShowPassDialog';
import ShowStatsDialog from '../Dialogs/ShowStatsDialog';
import InviteMorePeopleDialog from '../Dialogs/InviteMorePeopleDialog';
import SendMessageDialog from '../Dialogs/SendMessageDialog';
import EventMessages from './EventMessages';

import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
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
      statsOpen: false,
      messageText: ''
    };
  }

  openDialog = dialogType => {
    return () => {
      this.setState({ [dialogType + 'Open']: true });
    };
  };

  closeDialog = dialogType => {
    return () => {
      this.setState({ [dialogType + 'Open']: false });
    };
  };

  closeShare = () => {
    this.closeDialog('share')();
    this.props.clearInvite();
  };

  componentDidMount() {
    const { eventId, event, user } = this.props;
    this.props.getEvent(eventId);
    if (!event) {
      return;
    }

    this.configureAppHeader();
    if (
      user &&
      user.events &&
      !this.props.invite &&
      user.events[event.id] &&
      user.events[event.id].invite
    ) {
      this.props.getInvite(user.events[event.id].invite);
    } else {
      console.log('user:', user);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { event, user } = nextProps;
    console.log('will receive props');
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
          {isOwner
            ? [
                <FlatButton
                  label="Send Message"
                  onClick={this.openDialog('send')}
                />,
                <FlatButton
                  label="Show Stats"
                  onClick={this.openDialog('stats')}
                />
              ]
            : null}
          {canInviteMore ? (
            <FlatButton
              label="Invite Guests"
              onClick={this.openDialog('share')}
            />
          ) : (
            <FlatButton label="Cannot Invite More Guests" disabled={true} />
          )}
          {pass ? (
            <FlatButton label="Show Pass" onClick={this.openDialog('pass')} />
          ) : null}
        </EventCard>

        {canInviteMore ? (
          <InviteMorePeopleDialog
            event={event}
            show={this.state.shareOpen}
            onClose={this.closeShare}
          />
        ) : null}

        {pass ? (
          <ShowPassDialog
            pass={pass}
            show={this.state.passOpen}
            onClose={this.closeDialog('pass')}
          />
        ) : null}

        {isOwner
          ? [
              <SendMessageDialog
                event={event}
                show={this.state.sendOpen}
                onClose={this.closeDialog('send')}
              />,
              <ShowStatsDialog
                event={event}
                show={this.state.statsOpen}
                onClose={this.closeDialog('stats')}
              />
            ]
          : null}

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
    invite: state.invite
  };
};

export default connect(mapStateToProps, {
  getEvent,
  push,
  getInvite,
  setHeader,
  loadPass,
  monitorPass,
  clearInvite
})(EventDetail);
