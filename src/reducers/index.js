import EventsReducer from './EventsReducer';
import UserReducer from './UserReducer';
import InviteReducer from './InviteReducer';
import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';

export default combineReducers({
  events: EventsReducer,
  invite: InviteReducer,
  user: UserReducer,
  router: routerReducer
});
