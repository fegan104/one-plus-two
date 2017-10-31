const ADD_EVENT = "ADD_EVENT"

/**
 * This action can be dispatched where the reducer will then
 * add the event to the store.
 * @param {string} name 
 * @param {string} location 
 * @param {string} desc 
 * @param {DateTime} date 
 * @param {int} guestLimit 
 * @param {User[]} owners 
 * @param {boolean} isSelfEnrollable 
 */
export const addEvent = (name, location, desc, date, guestLimit, owners, isSelfEnrollable) => {
  return {
    type: ADD_EVENT,
    text,
    location,
    desc,
    date,
    guestLimit,
    owners
  }
}