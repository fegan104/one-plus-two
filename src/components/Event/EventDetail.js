import React from 'react';

import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';

import RaisedButton from 'material-ui/RaisedButton';

/**
 * Displays details about teh events specified in the route's id. 
 * Makes a request for the specified event frmo firebase and pulls it fomr the store.
 */
class EventDetail extends React.Component {
  componentDidMount() {
    this.props.getEvent(this.props.id);
  }

  render() {
    let { event } = this.props;
    let view = null;
    if (event) {
      view = (
        <div>
          <h1>Event: {event.title}</h1>
          <div>
            <RaisedButton label="Send Message" />
          </div>
          <div>
            <RaisedButton label="Invite People" />
          </div>
          <div>
            <RaisedButton label="Scan Pass" />
          </div>
        </div>
      );
    } else {
      view = <h1>loading...</h1>;
    }

    return view;
  }
}

/**
 * This function filters the redux store's evnts to find the
 * specific event to display on this page.
 * @param {*} state The redux store.
 * @param {*} ownProps The rect components props.
 * @returns an event model with the specified id and an id specified in the route.
 */
const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;
  const filtered = state.events.filter(e => e.id === eventId);
  const event = filtered[0] ? filtered[0] : undefined;
  return {
    event,
    id: eventId
  };
};

export default connect(mapStateToProps, { getEvent })(EventDetail);
