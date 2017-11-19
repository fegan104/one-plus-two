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
    this.props.loadEvents();
    this.configureAppHeader();
  }

  componentDidUpdate() {
    this.configureAppHeader();
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
        <Link to={`/event/${event.id}`} className="Home-link">
          {event.title}
        </Link>
      );
    });

    return (
      <div>
        Hello from Event Detail
        <br />
        {eventDivs}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.events
  };
};

export default connect(mapStateToProps, { loadEvents, setHeader })(EventList);
