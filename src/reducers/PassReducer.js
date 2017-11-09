import actionType from '../constants';

/**
 * Reduces the pass actions into a single pass.
 */
export default (store = {}, action) => {
  switch (action.type) {
    case actionType.EXCHANGE_INVITE_FULFILLED: {
      return action.payload;
    }
    default:
      return store;
  }
};
