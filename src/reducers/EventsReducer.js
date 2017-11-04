import actionType from '../constants';

let initialStore = {};

export default (store = initialStore, action) => {
  switch (action.type) {
    case actionType.LOAD_EVENTS_SUCCESS: {
      return { ...store, ...action.payload };
    }

    default:
      return store;
  }
};
