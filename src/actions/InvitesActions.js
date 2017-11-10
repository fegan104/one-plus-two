import {
  getInviteFromDB,
  getEventFromDB,
  pushInviteToDB
} from '../services/FirebaseService';
import actionType from '../constants';

export const getInvite = id => {
  return dispatch => {
    dispatch({
      type: actionType.GET_INVITE_REQUEST
    });

    getInviteFromDB(id)
      .then(invite => {
        dispatch({
          type: actionType.GET_INVITE_SUCCESS_EMPTY_EVENT_INFO,
          payload: invite
        });

        getEventFromDB(invite.eventId)
          .then(event => {
            dispatch({
              type: actionType.GET_INVITE_SUCCESS,
              payload: invite.setEvent(event)
            });
          })
          .catch(error => {
            dispatch({
              type: actionType.GET_INVITE_FAILED,
              payload: error
            });
          });
      })
      .catch(error => {
        dispatch({
          type: actionType.GET_INVITE_FAILED,
          payload: error
        });
      });
  };
};

export const addInvite = (newInvite, yourInvite) => {
  return {
    type: actionType.ADD_INVITE,
    payload: pushInviteToDB(newInvite, yourInvite)
  };
};
