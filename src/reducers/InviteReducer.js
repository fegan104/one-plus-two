import actionType from '../constants';

/**
 * Reduces invite related actions into an array of InviteModels.
 */
export default (state = null, action) => {
  switch (action.type) {
    case actionType.GET_INVITE_SUCCESS: {
      return action.payload;
    }

    case actionType.GET_INVITE_SUCCESS_EMPTY_EVENT_INFO: {
      return action.payload;
    }

    case actionType.SIGNOUT_SUCCESS: {
      return null;
    }

    default:
      return state;
  }
};
