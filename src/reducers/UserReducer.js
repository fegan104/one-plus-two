import actionType from '../constants';

/**
 * Reduces the action payload to a single User object in the store.
 */
export default (store = {}, action) => {
  switch (action.type) {
    case actionType.MOCK_SIGN_IN_FULFILLED: {
      return {
        ...store,
        ...action.payload
      };
    }
    default:
      return store;
  }
};
