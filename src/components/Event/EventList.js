import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from '../../actions/EventsActions';

/**
 * This is the container component for the event creation screen.
 */
class EventList extends Component {
  componentDidMount() {
    this.props.loadEvents();
  }

  render() {
    let { events } = this.props;

    let eventDivs = events.map(event => {
      return <h1 key={event.id}>{event.title}</h1>;
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

export default connect(mapStateToProps, { loadEvents })(EventList);
