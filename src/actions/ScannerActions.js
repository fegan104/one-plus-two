import actionType from '../constants';
import { claimPassInDB } from '../services/FirebaseService';

export const claimPass = passId => {
  return {
    type: actionType.CLAIM_PASS,
    payload: claimPassInDB(passId)
  };
};
