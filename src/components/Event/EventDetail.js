import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadEvents } from '../../actions/EventsActions';

/**
 * This is the container component for the event creation screen.
 */
class EventDetail extends Component {
  componentDidMount() {
    this.props.loadEvents();
  }

  render() {
    let { events } = this.props;

    let eventDivs = Object.keys(events).map(id => {
      let event = events[id];
      return <h1 key={id}>{event.title}</h1>;
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

export default connect(mapStateToProps, { loadEvents })(EventDetail);
