import actionType from '../constants';
import {
  loginViaFirebase,
  signOutViaFirebase,
  getUserData,
  getFCMToken
} from '../services/FirebaseService';

export const showLoginModal = () => {
  return {
    type: actionType.SHOW_LOGIN_MODAL
  };
};

export const hideLoginModal = () => {
  return {
    type: actionType.HIDE_LOGIN_MODAL
  };
};

export const authStateChange = user => {
  return dispatch => {
    dispatch({
      type: actionType.AUTH_STATE_CHANGE,
      payload: user
    });

    getUserData(user.id)
      .then(data => {
        dispatch({
          type: actionType.GET_USER_DATA_SUCCESS,
          payload: user.setEvents(data.events)
        });
      })
      .catch(error => {
        dispatch({
          type: actionType.GET_USER_DATA_FAILED,
          payload: error
        });
      });
  };
};

export const refreshToken = user => {
  return getFCMToken(user);
};

export const login = provider => {
  return dispatch => {
    dispatch({
      type: actionType.LOGIN_REQUEST
    });

    loginViaFirebase(provider);
  };
};

export const signOut = () => {
  return dispatch => {
    dispatch({
      type: actionType.SIGNOUT_REQUEST
    });

    signOutViaFirebase()
      .then(user => {
        dispatch({
          type: actionType.SIGNOUT_SUCCESS
        });
      })
      .catch(error => {
        dispatch({
          type: actionType.SIGNOUT_REJECTED,
          payload: error
        });
      });
  };
};
