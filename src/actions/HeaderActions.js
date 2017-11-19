import actionType from '../constants';

export const setHeader = params => {
  return {
    type: actionType.SET_HEADER,
    payload: params
  };
};
