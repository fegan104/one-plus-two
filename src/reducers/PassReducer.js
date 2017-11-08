import actionType from '../constants';

/**
 * Reduces the pass actions into a pass array.
 */
export default (store = [], action) => {
  switch (action.type) {
    case actionType.ADD_PASS_FULFILLED: {
      return [...store, action.payload];
    }
    default:
      return store;
  }
};
