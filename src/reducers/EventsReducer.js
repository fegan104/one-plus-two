import actionType from '../constants';

/**
 * Reduces actions into an array of Events.
 */
export default (state = [], action) => {
  switch (action.type) {
    case actionType.LOAD_EVENTS_SUCCESS: {
      return action.payload;
    }
    case actionType.ADD_EVENT_FULFILLED: {
      return [...state, action.payload];
    }
    case actionType.GET_EVENT_FULFILLED: {
      return [action.payload];
    }

    default:
      return state;
  }
};
