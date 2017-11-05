import { getEventsDB, pushEventToDB } from '../services/FirebaseService';
import actionType from '../constants';

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
export const addEvent = (
  title,
  location,
  desc,
  date,
  time,
  guestLimit,
  owner,
  isSelfEnrollable
) => {
  //We need to combine  the selected day and the
  //selected time into one date time
  const selectedTime = new Date(time);
  const dateTime = new Date(date);
  console.log('dateTime:', dateTime);
  console.log('selectedTime:', selectedTime);
  dateTime.setHours(selectedTime.getHours());
  dateTime.setMinutes(selectedTime.getMinutes());
  return {
    type: actionType.ADD_EVENT,
    payload: pushEventToDB({
      title,
      location,
      desc,
      dateTime: dateTime.toUTCString(),
      guestLimit,
      owner,
      isSelfEnrollable
    })
  };
};
