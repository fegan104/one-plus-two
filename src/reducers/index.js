import EventsReducer from './EventsReducer';
import UserReducer from './UserReducer';
import { routerReducer } from 'react-router-redux';

import { combineReducers } from 'redux';

export default combineReducers({
  events: EventsReducer,
  user: UserReducer,
  router: routerReducer
});
