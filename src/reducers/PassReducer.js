import actionType from '../constants';

/**
 * Reduces the pass actions into a single pass.
 */
export default (state = null, action) => {
  switch (action.type) {
    case actionType.ACCEPT_INVITE_FULFILLED: {
      return action.payload;
    }
    case actionType.GET_PASS_FULFILLED: {
      return action.payload;
    }
    case actionType.REFRESH_PASS_FULFILLED: {
      return action.payload;
    }
    default:
      return state;
  }
};
