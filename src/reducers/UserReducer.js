import actionType from '../constants';

const initialState = {
  loggedIn: false,
  inProgress: false,
  userObject: null,
  errors: null
};

/**
 * Reduces the action payload to a single User object in the state.
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionType.LOGIN_REQUEST: {
      return { ...state, inProgress: true };
    }

    case actionType.AUTH_STATE_CHANGE: {
      return {
        loggedIn: true,
        inProgress: false,
        errors: null,
        userObject: action.payload
      };
    }

    default:
      return state;
  }
};
