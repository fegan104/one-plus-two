import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { ADD_EVENT } from './Event/actions.js'
import { MOCK_SIGN_IN } from './SignIn/actions.js'

//This is the initial state of our application before any data 
//is loaded through actions
const initialState = {
  events: []
}

//Create the reducer for our application
const eventsReducer = (store = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT: {
      return {
        ...store,
        events: [
          ...store.events,
          action.payload
        ]
      }
    }
    default:
      return store;
  }
}

const userReducer = (store = {}, action) => {
  switch (action.type) {
    case `${MOCK_SIGN_IN}_FULFILLED`: {
      return {
        ...store,
        user: action.payload
      }
    }
    default:
      return store;
  }
}


/**
 * This is the combined reducer for our entire application. Any time an action is dispatched
 * the onePlusTwoReducer will hand off the reducing to one of the specified reducers below.
 * The reducer will receive a subset of the state that matches its name, and the action 
 * that was dispatched. They each return a new piece of the state.
 */
const onePlusTwoReducer = combineReducers({
  events: eventsReducer,
  user: userReducer,
  router: routerReducer
})

export default onePlusTwoReducer