import actionType from '../constants';
import { checkInPassInDB } from '../services/FirebaseService';

export const checkInPass = passId => {
  return {
    type: actionType.CHECK_IN_PASS,
    payload: checkInPassInDB(passId)
  };
};
