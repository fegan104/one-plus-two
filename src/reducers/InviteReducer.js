import actionType from '../constants';

let initialStore = [];

export default (store = initialStore, action) => {
  switch (action.type) {
    case actionType.GET_INVITE_SUCCESS: {
      return action.payload;
    }

    default:
      return store;
  }
};
