import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';

import FlatButton from 'material-ui/FlatButton';
import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';
import { push } from 'react-router-redux';

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
          {/* Card of the event. */}
          <Card>
            <CardMedia
              overlay={<CardTitle title={event.title.toUpperCase()} />}
            >
              <img src={event.picture} alt="banner" className="banner" />
            </CardMedia>
            <CardText>{event.desc}</CardText>
            <CardActions>
              <FlatButton label="Send Message" />
              <FlatButton label="Invite People" />
            </CardActions>
          </Card>
          {/* The FAB */}
          <Fab
            className="fab"
            secondary={true}
            onClick={_ => this.props.push('/scanner')}
          >
            <CropFree style={{ fill: '#000' }} />
          </Fab>
        </div>
      );
    } else {
      view = <h1>loading...</h1>;
    }

    return <div className="EventDetail">{view}</div>;
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
  const event = filtered[0] ? filtered[0] : undefined;
  return {
    event,
    id: eventId
  };
};

export default connect(mapStateToProps, { getEvent, push })(EventDetail);
