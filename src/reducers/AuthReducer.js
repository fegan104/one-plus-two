import actionType from '../constants';

const initialState = {
  loggedIn: false,
  inProgress: false,
  userObject: null,
  errors: null,
  showLoginModal: false
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
        ...initialState,
        loggedIn: true,
        userObject: action.payload
      };
    }

    case actionType.GET_USER_DATA_SUCCESS: {
      return { ...state, userObject: action.payload };
    }

    case actionType.SIGNOUT_SUCCESS: {
      return { ...initialState };
    }

    case actionType.SIGNOUT_REJECTED: {
      return { ...state, errors: action.payload };
    }

    case actionType.SHOW_LOGIN_MODAL: {
      return { ...initialState, showLoginModal: true };
    }

    case actionType.HIDE_LOGIN_MODAL: {
      return { ...initialState, showLoginModal: false };
    }

    case actionType.REFRESH_TOKEN_FULFILLED: {
      return {
        ...state,
        userObject: {
          ...state.userObject,
          fcmToken: action.payload
        }
      };
    }

    case actionType.ADD_EVENT_TO_USER: {
      const newEvent = {};
      newEvent[action.payload] = { isOwner: true };
      return {
        ...state,
        userObject: {
          ...state.userObject,
          events: {
            ...state.userObject.events,
            ...newEvent
          }
        }
      };
    }

    default:
      return state;
  }
};
