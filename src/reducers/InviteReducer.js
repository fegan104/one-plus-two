import actionType from '../constants';

/**
 * Reduces invite related actions into an array of InviteModels.
 */
export default (state = {}, action) => {
  switch (action.type) {
    case actionType.GET_INVITE_SUCCESS: {
      return action.payload;
    }

    case actionType.GET_INVITE_SUCCESS_EMPTY_EVENT_INFO: {
      return action.payload;
    }

    default:
      return state;
  }
};
