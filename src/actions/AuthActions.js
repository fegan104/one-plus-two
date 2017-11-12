import actionType from '../constants';
import {
  loginViaFirebase,
  signOutViaFirebase
} from '../services/FirebaseService';

export const authStateChange = user => {
  return {
    type: actionType.AUTH_STATE_CHANGE,
    payload: user
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
