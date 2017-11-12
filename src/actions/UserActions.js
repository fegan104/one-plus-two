import actionType from '../constants';
import { loginViaFirebase } from '../services/FirebaseService';

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
