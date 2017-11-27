import actionType from '../constants';
import { push } from 'react-router-redux';

import { acceptInviteInDB } from '../services/FirebaseService';

export const acceptInvite = (inviteId, eventId, userId) => {
  return dispatch => {
    return {
      type: actionType.ACCEPT_INVITE,
      payload: acceptInviteInDB(inviteId, eventId, userId)
        .then(passObj => {
          dispatch(push(`/event/${eventId}`));
          return passObj;
        })
        .catch(error => {
          console.log(error);
        })
    };
  };
};
