import React from 'react';
import './EventCard.css';
import FlatButton from 'material-ui/FlatButton';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

const EventCard = ({ event, openInvite, openSend }) => {
  return (
    <Card>
      <CardMedia overlay={<CardTitle title={event.title.toUpperCase()} />}>
        <img src={event.picture} alt="banner" className="banner" />
      </CardMedia>
      <CardText>{event.desc}</CardText>
      <CardActions>
        <FlatButton label="Send Message" onClick={openSend} />
        <FlatButton label="Invite People" onClick={openInvite} />
      </CardActions>
    </Card>
  );
};

export default EventCard;
