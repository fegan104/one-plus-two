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
        let newUser = user.setEvents(data.events);
        newUser.age = data.age;
        newUser.gender = data.gender;

        dispatch({
          type: actionType.GET_USER_DATA_SUCCESS,
          payload: newUser
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
  return {
    type: actionType.REFRESH_TOKEN,
    payload: getFCMToken(user)
  };
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

export const addUserEvent = newEventId => {
  return {
    type: actionType.ADD_EVENT_TO_USER,
    payload: newEventId
  };
};
