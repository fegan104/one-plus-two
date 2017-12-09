import actionType from '../constants';
/**
 * reduces the scan result to true or false
 */
export default (state = false, action) => {
  switch (action.type) {
    case actionType.CHECK_IN_PASS_FULFILLED: {
      return true;
    }
    case actionType.CHECK_IN_PASS_REJECTED: {
      return false;
    }
    default:
      return state;
  }
};
