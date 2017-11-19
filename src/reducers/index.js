import EventsReducer from './EventsReducer';
import InviteReducer from './InviteReducer';
import PassReducer from './PassReducer';
import InviteLinkReducer from './InviteLinkReducer';
import AuthReducer from './AuthReducer';
import ScannerReducer from './ScannerReducer';
import HeaderReducer from './HeaderReducer';
import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';

export default combineReducers({
  events: EventsReducer,
  invite: InviteReducer,
  inviteLink: InviteLinkReducer,
  pass: PassReducer,
  auth: AuthReducer,
  router: routerReducer,
  scanned: ScannerReducer,
  header: HeaderReducer
});
