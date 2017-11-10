import React from 'react';
import './EventDetail.css';
import { connect } from 'react-redux';

import { getEvent } from '../../actions/EventsActions';
import { addInvite } from '../../actions/InvitesActions';
import InviteModel from '../../models/InviteModel';

import Fab from 'material-ui/FloatingActionButton';
import CropFree from 'material-ui/svg-icons/image/crop-free';
import Dialog from 'material-ui/Dialog';
import EventCard from './EventCard';
import FlatButton from 'material-ui/FlatButton';
import { push } from 'react-router-redux';

/**
 * Displays details about teh events specified in the route's id. 
 * Makes a request for the specified event frmo firebase and pulls it fomr the store.
 */
class EventDetail extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
    let { event, id } = this.props;
    let invite = InviteModel({
      additionalInvitesLeft: 2,
      isUsed: false,
      event: id
    });
    invite = invite.setEvent(event);
    this.props.addInvite(invite);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    this.props.getEvent(this.props.id);
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton label="Copy" primary={true} onClick={this.handleClose} />
    ];
    let { event, invite } = this.props;
    let view = null;
    if (event) {
      view = (
        <div>
          <EventCard event={event} openInvite={this.handleOpen} />

          <Dialog
            title="Your invite link"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            {`https://www.one-plus-two.com/invite/${invite.id}`}
          </Dialog>

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
  const event = filtered[0];
  return {
    event,
    invite: state.invite,
    id: eventId
  };
};

export default connect(mapStateToProps, { getEvent, push, addInvite })(
  EventDetail
);
