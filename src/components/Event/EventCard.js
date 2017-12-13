import React from 'react';
import './EventCard.css';
import {
  Card,
  CardActions,
  CardMedia,
  CardTitle,
  CardText
} from 'material-ui/Card';

const EventCard = ({ event, children }) => {
  return (
    <Card>
      <CardMedia overlay={<CardTitle title={event.title.toUpperCase()} />}>
        <div className="banner-wrapper">
          <img src={event.picture} alt="banner" className="banner" />
        </div>
      </CardMedia>
      <CardText>{event.desc}</CardText>
      <CardActions>{children}</CardActions>
    </Card>
  );
};

export default EventCard;
