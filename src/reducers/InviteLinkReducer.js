import actionType from '../constants';

/**
 * Our store holds an invite which represents the user's invite for whatever 
 * event they're looking at but also an inviteLink which represents a link they can share.
 */
export default (store = '', action) => {
  switch (action.type) {
    case actionType.ADD_INVITE_FULFILLED: {
      return action.payload;
    }

    default:
      return store;
  }
};
