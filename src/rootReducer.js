import { combineReducers } from 'redux'
import {routerReducer} from 'react-router-redux'

const events = (events = [], action) => {
  return events;
}

/**
 * This is the combined reducer for our entire application. Any time an action is dispatched
 * the onePlusTwoReducer will hand off the reducing to one of the specified reducers below.
 * The reducer will receive a subset of the state that matches its name, and the action 
 * that was dispatched. They each return a new piece of the state.
 */
const onePlusTwoReducer = combineReducers({
  events,
  router: routerReducer
})

export default onePlusTwoReducer