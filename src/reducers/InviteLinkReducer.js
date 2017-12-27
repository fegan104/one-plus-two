import actionType from '../constants';

/**
 * Our store holds an invite which represents the user's invite for whatever
 * event they're looking at but also an inviteLink which represents a link they can share.
 */
export default (state = '', action) => {
  switch (action.type) {
    case actionType.GENERATE_NEW_INVITE_FULFILLED: {
      return action.payload;
    }

    case actionType.CLEAR_INVITE: {
      return '';
    }

    case actionType.SIGNOUT_SUCCESS: {
      return '';
    }

    default:
      return state;
  }
};
