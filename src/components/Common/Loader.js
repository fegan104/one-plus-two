import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loader = () => {
  let loaderStyle = {
    textAlign: 'center',
    marginTop: '50px'
  };

  return (
    <div style={loaderStyle}>
      <CircularProgress size={80} thickness={5} />
    </div>
  );
};

export default Loader;
