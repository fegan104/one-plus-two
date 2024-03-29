import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';
import { getInviteInfoWithoutPermissions } from '../../actions/InvitesActions';
import { acceptInvite } from '../../actions/PassActions';
import { setHeader } from '../../actions/HeaderActions';
import { showLoginModal } from '../../actions/AuthActions';

import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import { push } from 'react-router-redux';

import Loader from '../Common/Loader';

class InviteForEvent extends React.Component {
  componentDidMount() {
    const { inviteId } = this.props;

    if (inviteId) {
      this.props.getInviteInfoWithoutPermissions(inviteId);
    }

    this.configureAppHeader();
  }

  componentWillReceiveProps(nextProps) {
    let { invite } = nextProps;
    const event = invite && invite.event;

    if (invite && invite.event) {
      this.configureAppHeader(nextProps);
    }

    if (
      event &&
      this.props.user &&
      this.props.user.events &&
      this.props.user.events[event.id] &&
      this.props.user.events[event.id].pass
    ) {
      console.log('props:', this.props);
      this.props.push(`/event/${event.id}`);
    }
  }

  configureAppHeader = (nextProps = this.props) => {
    let { invite } = nextProps;
    let event = invite && invite.event;

    this.props.setHeader({
      pageTitle: event && event.title,
      headerTitle: event && event.title,
      backButton: '/events'
    });
  };

  handleAcceptInvite = () => {
    let { invite, user } = this.props;

    if (!user) {
      this.props.showLoginModal();
      return;
    }
    if (!invite || !invite.event) {
      console.log("something's wrong with your invite 😬");
      return;
    }

    this.props.acceptInvite(invite.id, invite.event.id, user.id);
  };

  render() {
    let { invite } = this.props;
    let event = invite && invite.event;

    if (!event) {
      return <Loader />;
    }

    const acceptButton =
      event &&
      this.props.user &&
      this.props.user.events &&
      this.props.user.events[event.id] &&
      this.props.user.events[event.id].invite ? null : (
        <FlatButton label="Accept Invite" onClick={this.handleAcceptInvite} />
      );

    if (
      event &&
      this.props.user &&
      this.props.user.events &&
      this.props.user.events[event.id] &&
      this.props.user.events[event.id].pass
    ) {
      console.log('navigating to event');
      this.props.push(`/event/${event.id}`);
    }

    return (
      <div className="EventDetail">
        <EventCard event={event}>{acceptButton}</EventCard>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const inviteId = ownProps.match.params.id;

  return {
    invite: state.invite,
    inviteId: inviteId,
    user: state.auth.userObject
  };
};

export default connect(mapStateToProps, {
  getEvent,
  push,
  getInviteInfoWithoutPermissions,
  acceptInvite,
  setHeader,
  showLoginModal
})(InviteForEvent);
