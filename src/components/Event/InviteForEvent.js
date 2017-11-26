import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';
import { getInvite } from '../../actions/InvitesActions';
import { acceptInvite } from '../../actions/PassActions';
import { setHeader } from '../../actions/HeaderActions';

import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import { push } from 'react-router-redux';

class InviteForEvent extends React.Component {
  componentDidMount() {
    const { inviteId } = this.props;

    if (inviteId) {
      this.props.getInvite(inviteId);
    }

    this.configureAppHeader();
  }

  componentWillReceiveProps(nextProps) {
    let { invite } = nextProps;

    if (invite && invite.event) {
      this.configureAppHeader(nextProps);
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

    if (!invite || !invite.event || !user) {
      return;
    }

    this.props.acceptInvite(invite.id, invite.event.id, user.id);
  };

  render() {
    let { invite } = this.props;
    let event = invite && invite.event;
    let view = null;
    if (invite && event) {
      view = (
        <div>
          <EventCard event={event}>
            <FlatButton
              label="Accept Invite Now!!!"
              onClick={this.handleAcceptInvite}
            />
          </EventCard>
        </div>
      );
    } else {
      view = <h1>loading...</h1>;
    }

    return <div className="EventDetail">{view}</div>;
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
  getInvite,
  acceptInvite,
  setHeader
})(InviteForEvent);
