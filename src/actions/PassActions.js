import actionType from '../constants';

import { exchangeInviteForPass } from '../services/FirebaseService';

export const claimInvite = (invite, event, userId) => {
  return {
    type: actionType.EXCHANGE_INVITE,
    payload: exchangeInviteForPass(invite, event, userId)
  };
};
