import EventsReducer from './EventsReducer';
import InviteReducer from './InviteReducer';
import PassReducer from './PassReducer';
import AuthReducer from './AuthReducer';
import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';

export default combineReducers({
  events: EventsReducer,
  invite: InviteReducer,
  pass: PassReducer,
  auth: AuthReducer,
  router: routerReducer
});
