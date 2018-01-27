import {
  getEventsDB,
  pushEventToDB,
  getEventFromDB,
  pushMessageToDB,
  uploadBannerToDB,
  getEventStatsFromCloudFunction
} from '../services/FirebaseService';
import { addUserEvent } from './AuthActions';
import actionType from '../constants';
import { push } from 'react-router-redux';

export const loadEvents = eventIds => {
  return dispatch => {
    dispatch({
      type: actionType.LOAD_EVENTS_REQUEST
    });
    getEventsDB(eventIds)
      .then(events => {
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
          dispatch(push(`/event/${newEvent.id}`));
          return newEvent;
        })
        .then(newEvent => {
          dispatch(addUserEvent(newEvent.id));
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

export const uploadBanner = file => {
  return {
    type: actionType.UPLOAD_BANNER,
    payload: uploadBannerToDB(file)
  };
};

export const getEventStats = eventId => {
  return dispatch => {
    dispatch({
      type: actionType.GET_EVENT_STATS_REQUEST
    });

    getEventStatsFromCloudFunction(eventId)
      .then(data => {
        dispatch({
          type: actionType.GET_EVENT_STATS_SUCCESS,
          payload: data
        });
      })
      .catch(error => {
        dispatch({
          type: actionType.GET_EVENT_STATS_FAILED,
          payload: error
        });
      });
  };
};
