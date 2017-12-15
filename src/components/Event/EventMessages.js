import React from 'react';

const EventMessages = ({ newsFeed }) => {
  return (
    <div style={{ marginBottom: '72px' }}>
      {newsFeed
        .map((m, i) => (
          <div className="message-bubble" key={i}>
            <pre>{m.body}</pre>
          </div>
        ))
        .reverse()}
    </div>
  );
};

export default EventMessages;
