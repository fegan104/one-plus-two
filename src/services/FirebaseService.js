import * as firebase from 'firebase';
import EventModel from '../models/EventModel';
import InviteModel from '../models/InviteModel';
import PassModel from '../models/PassModel';

// eslint-disable-next-line
let database;

/**
 * Initializes our firebase instance. Called in App contructor.
 */
export const init = () => {
  let config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
    database = firebase.database();
  }
};

/**
 * Returns a Promise to an array of EventModels from firebase.
 */
export const getEventsDB = () => {
  return new Promise((resolve, reject) => {
    database
      .ref('/events')
      .once('value')
      .then(req => {
        let dbObj = req.val();
        let events = [];

        events = Object.keys(dbObj).map(id => {
          return EventModel({ id, ...dbObj[id] });
        });

        return resolve(events);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Returns a promise to the specified EventModel.
 * @param {string} eventId is the pushId of the requested event.
 */
export const getEventFromDB = eventId => {
  return new Promise((resolve, reject) => {
    database
      .ref(`/events/${eventId}`)
      .once('value')
      .then(dbObj => {
        let event = EventModel({ id: dbObj.key, ...dbObj.val() });

        return resolve(event);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Pushes a new event to firebase. Note owners will be pushed as a 
 * pushId/userId key/value pair.
 * @param {EventModel} newEvent the Event object to be pushed to firebase.
 */
export const pushEventToDB = newEvent => {
  const ownerId = newEvent.owner;
  delete newEvent.owner;
  return database
    .ref('/events')
    .push(newEvent)
    .then(event => event.child('owners').push(ownerId))
    .then(event => event.parent.parent.once('value'))
    .then(snap => {
      let obj = {};
      obj[snap.key] = snap.val();
      return obj;
    });
};

/**
 * Returns a promise to an InvviteModel of the requested invite.
 * @param {string} inviteId the pushId we want to request.
 */
export const getInviteFromDB = inviteId => {
  return new Promise((resolve, reject) => {
    database
      .ref(`/invites/${inviteId}`)
      .once('value')
      .then(dbObj => {
        let invite = InviteModel({ id: dbObj.key, ...dbObj.val() });

        return resolve(invite);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Pushes a new PassModel to /passes.
 * @param {PassModel} newPass a PassModel.
 */
export const pushPassToDB = newPass => {
  delete newPass.id;
  return database
    .ref('passes')
    .push(newPass)
    .then(pass => pass.once('value'))
    .then(snap =>
      PassModel({
        ...snap.val(),
        id: snap.key
      })
    );
};
