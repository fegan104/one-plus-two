import actionType from '../constants';

export default (state = null, action) => {
  switch (action.type) {
    case actionType.GET_EVENT_STATS_SUCCESS: {
      return action.payload;
    }

    case actionType.GET_EVENT_STATS_REQUEST: {
      return null;
    }

    default:
      return state;
  }
};
