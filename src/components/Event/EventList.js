import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from '../../actions/EventsActions';
import { setHeader } from '../../actions/HeaderActions';

import { push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';

/**
 * This is the container component for the event creation screen.
 */
class EventList extends Component {
  componentDidMount() {
    this.configureAppHeader();

    if (this.props.user && this.props.user.events) {
      this.props.loadEvents(Object.keys(this.props.user.events));
    }
  }

  componentWillReceiveProps(newProps) {
    let user = newProps.user;
    let userId = user && user.id;

    if (
      userId &&
      user.events &&
      !(this.props.user && this.props.user.events === user.events)
    ) {
      this.props.loadEvents(Object.keys(user.events));
    }
  }

  configureAppHeader = () => {
    this.props.setHeader({
      pageTitle: 'Events List',
      headerTitle: 'Events',
      backButton: '/'
    });
  };

  render() {
    let { events } = this.props;
    let options = {
      hour: 'numeric',
      minute: 'numeric',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    if (events.length === 0) return <h2>You don't have any events yet.</h2>;

    let eventDivs = events.map(event => {
      return (
        <div key={event.id}>
          <ListItem
            primaryText={event.title}
            secondaryText={new Date(event.dateTime).toLocaleDateString(
              'en-US',
              options
            )}
            leftAvatar={
              <img
                src={event.picture}
                alt="Event banner"
                style={{ height: '40px', width: '40px' }}
              />
            }
            onClick={_ => this.props.push(`/event/${event.id}`)}
          />
          <Divider inset={true} />
        </div>
      );
    });

    return <List>{eventDivs}</List>;
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    user: state.auth.userObject
  };
};

export default connect(mapStateToProps, { loadEvents, setHeader, push })(
  EventList
);
