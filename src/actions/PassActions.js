import actionType from '../constants';
import { push } from 'react-router-redux';

import { acceptInviteInDB, getPassFromDB } from '../services/FirebaseService';

export const acceptInvite = (inviteId, eventId, userId) => {
  return dispatch => {
    return {
      type: actionType.ACCEPT_INVITE,
      payload: acceptInviteInDB(inviteId, eventId, userId)
        .then(passObj => {
          dispatch(push(`/event/${eventId}`)); //TODO don't push here?
          return passObj;
        })
        .catch(error => {
          console.log(error);
        })
    };
  };
};

export const loadPass = passId => {
  return {
    type: actionType.GET_PASS,
    payload: getPassFromDB(passId)
  };
};
