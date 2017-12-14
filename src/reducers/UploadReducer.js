import actionType from '../constants';

/**
 * Reduces the upload action into a url.
 */
export default (state = '', action) => {
  switch (action.type) {
    case actionType.UPLOAD_BANNER_FULFILLED: {
      return action.payload;
    }
    default:
      return state;
  }
};
