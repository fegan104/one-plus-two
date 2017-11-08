import actionType from '../constants';

import { pushPassToDB } from '../services/FirebaseService';

/**
 * Dispacth this action when a user requests a pass 
 * from their invite.
 * @param {PassModel} newPass Created form a PassModel.
 */
export const addPass = newPass => {
  return {
    type: actionType.ADD_PASS,
    payload: pushPassToDB(newPass)
  };
};
