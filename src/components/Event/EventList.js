import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from '../../actions/EventsActions';
import { setHeader } from '../../actions/HeaderActions';

import { Link } from 'react-router-dom';

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

    let eventDivs = events.map(event => {
      return (
        <Link to={`/event/${event.id}`} key={event.id} className="Home-link">
          {event.title}
        </Link>
      );
    });

    return <div>{eventDivs}</div>;
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    user: state.auth.userObject
  };
};

export default connect(mapStateToProps, { loadEvents, setHeader })(EventList);
