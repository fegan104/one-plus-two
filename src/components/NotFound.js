import React from 'react';

const NotFound = () => {
  return (
    <h2 style={{ textAlign: 'center' }}>
      <div>404 Page not found.</div>
      Try looking somewhere else{' '}
      <span role="img" aria-label="man sleuth">
        🕵️‍
      </span>
      <div>
        or just go <a href="/">home</a>
      </div>
    </h2>
  );
};

export default NotFound;
