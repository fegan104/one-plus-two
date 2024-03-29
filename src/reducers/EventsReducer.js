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
      //TODO update newly fetched event in store
      return [...state.filter(e => e.id !== action.payload.id), action.payload];
    }
    case actionType.ADD_MESSAGE_FULFILLED: {
      return [
        { ...state[0], newsFeed: [...state[0].newsFeed, action.payload] }
      ];
    }
    case actionType.SIGNOUT_SUCCESS: {
      return [];
    }

    default:
      return state;
  }
};
