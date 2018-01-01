import actionType from '../constants';
import { push } from 'react-router-redux';

import {
  acceptInviteInDB,
  getPassFromDB,
  monitorPassInDB
} from '../services/FirebaseService';

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

export const loadPass = passId => {
  return {
    type: actionType.GET_PASS,
    payload: getPassFromDB(passId)
  };
};

export const monitorPass = passId => {
  return dispatch => {
    dispatch({
      type: actionType.REFRESH_PASS
    });

    monitorPassInDB(passId).then(passObj => {
      dispatch({
        type: actionType.REFRESH_PASS_FULFILLED,
        payload: passObj
      });
    });
  };
};
