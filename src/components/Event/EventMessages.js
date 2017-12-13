import React from 'react';
import { List, ListItem } from 'material-ui/List';
import { Card } from 'material-ui/Card';

const EventMessages = ({ newsFeed }) => {
  return (
    <List style={{ marginBottom: '52px' }}>
      {newsFeed
        .map((m, i) => (
          <div
            key={i}
            style={{
              background: '#eee',
              color: '#000',
              fontSize: '18px',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '16px',
              marginLeft: '16px',
              marginRight: '16px',
              lineHeight: '150%'
            }}
          >
            {m.body}
          </div>
        ))
        .reverse()}
    </List>
  );
};

export default EventMessages;
