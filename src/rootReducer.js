import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { ADD_EVENT } from './CreateEvent/createEventActions.js'
import { MOCK_SIGN_IN } from './SignIn/signInActions.js'

//This is the initial state of our application before any data 
//is loaded through actions
const initialState = {
  user: {},
  events: []
}

//Create the reducer for our application
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EVENT: {
      return {
        ...state,
        events: [
          ...state.events,
          action.payload
        ]
      }
    }
    case `${MOCK_SIGN_IN}_FULFILLED`:{
      return{
        ...state,
        user: action.payload
      }
    }
    default:
      return state;
  }
}


/**
 * This is the combined reducer for our entire application. Any time an action is dispatched
 * the onePlusTwoReducer will hand off the reducing to one of the specified reducers below.
 * The reducer will receive a subset of the state that matches its name, and the action 
 * that was dispatched. They each return a new piece of the state.
 */
const onePlusTwoReducer = combineReducers({
  appReducer,
  router: routerReducer
})

export default onePlusTwoReducer