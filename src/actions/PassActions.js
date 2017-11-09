import actionType from '../constants';

import { exchangeInviteForPass } from '../services/FirebaseService';

export const claimInvite = (invite, user) => {
  return {
    type: actionType.EXCHANGE_INVITE,
    payload: exchangeInviteForPass(invite, user)
  };
};
