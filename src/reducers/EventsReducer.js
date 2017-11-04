import actionType from '../constants';

let initialStore = {};

export default (store = initialStore, action) => {
  switch (action.type) {
    case actionType.LOAD_EVENTS_SUCCESS: {
      return { ...store, ...action.payload };
    }
    case actionType.ADD_EVENT_FULFILLED: {
      return { ...store, ...action.payload };
    }

    default:
      return store;
  }
};
