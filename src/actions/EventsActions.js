import {
  getEventsDB,
  pushEventToDB,
  getEventFromDB
} from '../services/FirebaseService';
import actionType from '../constants';
import { push } from 'react-router-redux';

export const loadEvents = () => {
  return dispatch => {
    dispatch({
      type: actionType.LOAD_EVENTS_REQUEST
    });
    getEventsDB()
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

/**
 * This action can be dispatched where the reducer will then
 * add the event to the store.
 * @param {string} name 
 * @param {string} location 
 * @param {string} desc 
 * @param {DateTime} date 
 * @param {int} guestLimit 
 * @param {string} owner 
 * @param {boolean} isSelfEnrollable 
 */
export const addEvent = ({
  title,
  location,
  desc,
  date,
  time,
  guestLimit,
  picture,
  owner,
  isSelfEnrollable,
  ...rest
}) => {
  //We need to combine the selected day and the
  //selected time into one date time
  const selectedTime = new Date(time);
  const dateTime = new Date(date);
  dateTime.setHours(selectedTime.getHours());
  dateTime.setMinutes(selectedTime.getMinutes());
  return dispatch => {
    return {
      type: actionType.ADD_EVENT,
      payload: pushEventToDB({
        title,
        location,
        desc,
        dateTime: dateTime.toUTCString(),
        guestLimit,
        picture,
        owner,
        isSelfEnrollable
      }).then(newEvent => {
        dispatch(push(`/event/${newEvent.id}`));
        return newEvent;
      })
    };
  };
};

export const getEvent = eventId => {
  console.log('eventId:', eventId);
  return {
    type: actionType.GET_EVENT,
    payload: getEventFromDB(eventId)
  };
};
