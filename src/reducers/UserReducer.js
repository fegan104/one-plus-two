import actionType from '../constants';

export default (store = {}, action) => {
  switch (action.type) {
    case actionType.MOCK_SIGN_IN_FULFILLED: {
      return {
        ...store,
        ...action.payload
      };
    }
    default:
      return store;
  }
};
