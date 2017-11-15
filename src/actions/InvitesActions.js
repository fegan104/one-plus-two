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

/**
 * 
 * @param newInvite The new invite we're adding
 * @param event We use this for convenience
 * @param userId The user id of the inviter
 */
export const addInvite = (newInvite, event, userId) => {
  return {
    type: actionType.ADD_INVITE,
    payload: pushInviteToDB(newInvite, event, userId).then(val => {
      let inviteLink = `https://www.one-plus-two.com/event/${val.eventId}?invite=${val.id}`;
      return inviteLink;
    })
  };
};
