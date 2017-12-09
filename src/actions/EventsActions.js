import {
  getEventsDB,
  pushEventToDB,
  getEventFromDB,
  pushMessageToDB
} from '../services/FirebaseService';
import actionType from '../constants';
import { push } from 'react-router-redux';

export const loadEvents = eventIds => {
  return dispatch => {
    dispatch({
      type: actionType.LOAD_EVENTS_REQUEST
    });
    getEventsDB(eventIds)
      .then(events => {
        console.log('dispatching');
        dispatch({
          type: actionType.LOAD_EVENTS_SUCCESS,
          payload: events
        });
      })
      .catch(error => {
        dispatch({
          type: actionType.LOAD_EVENTS_FAILED,
          payload: error
        });
      });
  };
};

export const addEvent = event => {
  return dispatch => {
    return {
      type: actionType.ADD_EVENT,
      payload: pushEventToDB(event)
        .then(newEvent => {
          dispatch(push(`/event/${newEvent.id}`)); //TODO: actions should not do routing
          return newEvent;
        })
        .catch(error => {
          console.log(error);
        })
    };
  };
};

export const getEvent = eventId => {
  return {
    type: actionType.GET_EVENT,
    payload: getEventFromDB(eventId)
  };
};

export const sendMessage = (eventID, body) => {
  return {
    type: actionType.ADD_MESSAGE,
    payload: pushMessageToDB(eventID, body)
  };
};
