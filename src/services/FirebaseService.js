import * as firebase from 'firebase';
import EventModel from '../models/EventModel';

// eslint-disable-next-line
let database;

export const init = () => {
  let config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  };

  firebase.initializeApp(config);
  database = firebase.database();
};

export const getEventsDB = () => {
  return new Promise((resolve, reject) => {
    database
      .ref('/events')
      .once('value')
      .then(req => {
        let dbObj = req.val();
        let events = [];

        Object.keys(dbObj).forEach(id => {
          let obj = EventModel({ id, ...dbObj[id] });
          events.push(obj);
        });

        return resolve(events);
      })
      .catch(error => {
        reject(error);
      });
  });
};

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
