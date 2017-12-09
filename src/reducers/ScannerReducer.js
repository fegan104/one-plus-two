import actionType from '../constants';
/**
 * reduces the scan result to true or false
 */

const initState = { checkIn: false, loading: false, error: null };

export default (state = initState, action) => {
  switch (action.type) {
    case actionType.CHECK_IN_PASS: {
      return { ...initState, loading: true };
    }
    case actionType.CHECK_IN_PASS_FULFILLED: {
      return { ...initState, checkIn: true, user: action.payload };
    }
    case actionType.CHECK_IN_PASS_REJECTED: {
      return { ...initState, loading: false, error: action.payload.text };
    }
    default:
      return state;
  }
};
