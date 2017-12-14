import {
  getInviteFromDB,
  generateInviteCloudFunction,
  getInviteInfoFromCloudFunction
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
      })
      .catch(error => {
        dispatch({
          type: actionType.GET_INVITE_FAILED,
          payload: error
        });
      });
  };
};

export const getInviteInfoWithoutPermissions = id => {
  return dispatch => {
    dispatch({
      type: actionType.GET_INVITE_REQUEST
    });

    getInviteInfoFromCloudFunction(id)
      .then(invite => {
        dispatch({
          type: actionType.GET_INVITE_SUCCESS,
          payload: invite
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
export const generateNewInvite = event => {
  return {
    type: actionType.GENERATE_NEW_INVITE,
    payload: generateInviteCloudFunction(event).then(val => {
      let inviteLink = `https://www.one-plus-two.com/invite/${val.id}`;
      return inviteLink;
    })
  };
};

export const clearInvite = () => {
  return {
    type: actionType.CLEAR_INVITE
  };
};
