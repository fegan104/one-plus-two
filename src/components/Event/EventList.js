import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from '../../actions/EventsActions';
import { setHeader } from '../../actions/HeaderActions';

import { Link, push } from 'react-router-redux';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import LocalActivity from 'material-ui/svg-icons/maps/local-activity';

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
      console.log('events for user:', user);
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

    let eventDivs = events.map(event => {
      return (
        <div key={event.id}>
          <ListItem
            primaryText={event.title}
            secondaryText={event.dateTime}
            leftAvatar={
              <img
                src={event.picture}
                alt="Event baner"
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
