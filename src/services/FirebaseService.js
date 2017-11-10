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
 * pushId/userId key/value pair. This will also redirect to the event detail
 * screen of the new event.
 * @param {EventModel} newEvent the Event object to be pushed to firebase.
 * @returns a promise to an event model.
 */
export const pushEventToDB = newEvent => {
  console.log('newEvent:', newEvent);
  const ownerId = newEvent.owner;
  delete newEvent.owner;
  return database
    .ref('/events')
    .push(newEvent)
    .then(event => event.child('owners').push(ownerId))
    .then(event => event.parent.parent.once('value'))
    .then(snap => {
      let obj = snap.val();
      obj['id'] = snap.key;
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
const pushPassToDB = newPass => {
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

//TODO change to be a firebase function
/**
 * This fucntion returns a promise to a valid pass (if the invite was valid).
 * We check if the user already has a pass for the event if they do we get that one.
 * If they don't we use the invite and push that new pass to the db
 * 
 * @param invite 
 */
export const exchangeInviteForPass = async (invite, user) => {
  const { event } = invite;
  //Lets check if the user already has a pass for the event
  const usersPass = await database
    .ref('/')
    .child('passes')
    .orderByChild('user')
    .equalTo(`${user.id}`)
    .once('value')
    .then(snap => snap.val())
    .then(passes =>
      Object.keys(passes)
        .map(k => {
          passes[k]['id'] = k;
          return passes[k];
        })
        .filter(p => p.event === event.id)
    )
    .then(f => f[0]);

  //return the user's pass
  if (usersPass) {
    return Promise.resolve(usersPass);
  }
  //User doesn't have a pass lets check if we can even give them one
  const isUsed = await database
    .ref(`invites/${invite.id}/isUsed`)
    .once('value')
    .then(snap => snap.val());

  //if invite is used reject
  if (isUsed) {
    return Promise.reject('Pass already used');
  }
  //use invite
  await database.ref(`invites/${invite.id}`).update({ isUsed: true });
  //The invite is valid lets get a new pass
  return pushPassToDB(
    PassModel({
      desc: event.desc,
      isActive: false,
      isUsed: false,
      user: user.id,
      event: event.id
    })
  );
};
