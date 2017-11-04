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
          payload: events.val()
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
  name,
  location,
  desc,
  date,
  time,
  guestLimit,
  owner,
  isSelfEnrollable
) => {
  //TODO actually combine these times properly
  let dateTime = `${date} + ${time}`;
  return {
    type: actionType.ADD_EVENT,
    payload: pushEventToDB({
      name,
      location,
      desc,
      dateTime,
      guestLimit,
      owner,
      isSelfEnrollable
    })
  };
};
