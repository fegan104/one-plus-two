import * as firebase from 'firebase';
import EventModel from '../models/EventModel';
import InviteModel from '../models/InviteModel';
import PassModel from '../models/PassModel';
import constants from '../constants';

// eslint-disable-next-line
let database;
let auth;

/**
 * Initializes our firebase instance. Called in App contructor.
 */
export const init = authCallback => {
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
    auth = firebase.auth();

    auth.onAuthStateChanged(user => {
      authCallback(user);
    });
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

        if (dbObj) {
          events = Object.keys(dbObj).map(id => {
            return EventModel({ id, ...dbObj[id] });
          });
        }

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
        if (!dbObj) {
          return resolve(null);
        }

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
        if (!dbObj) {
          return resolve(null);
        }

        let invite = InviteModel({ id: dbObj.key, ...dbObj.val() });

        return resolve(invite);
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * When you push an invite to firebase you use up one of your 
 * invites left (unless you're an owner or the guest limit is reached),
 * and you get a link to the invite that can then be shared to anyone. This is also where
 * self enrollment can be done. TODO maybe make this a cloud function.
 * @param {InviteModel} newInvite 
 * @param userId of the inviter
 */
export const pushInviteToDB = async (newInvite, event, userId) => {
  //TODO check if owner
  const isOwnerPromise = database
    .ref(`/events/${event.id}/owners`)
    .once('value')
    .then(snap => snap.val())
    .then(owners => owners[userId])
    .catch(err => {
      console.error(err);
      return false;
    });

  const userPassPromise = database
    .ref('/')
    .child('passes')
    .orderByChild('user')
    .equalTo(userId)
    .once('value')
    .then(snap => snap.val())
    .then(owners => owners[userId])
    .catch(err => {
      console.error(err);
      return null;
    });

  let [isOwner, userPass] = await Promise.all([
    isOwnerPromise,
    userPassPromise
  ]);

  //If you aren't an owner and don't have invites left reject
  if (!isOwner || !(userPass && userPass.additionalInvitesLeft > 0)) {
    return Promise.reject("You don't have invites left.");
  }
  //Check if there have already been to many passes given out for the event
  const numberOfEventPasses = await database
    .ref('passes')
    .orderByChild('event')
    .equalTo(`${newInvite.event}`)
    .once('value')
    .then(snap => {
      if (snap.val()) {
        return Object.keys(snap.val()).length;
      }
      return 0;
    });
  //guest limit reached
  if (numberOfEventPasses >= event.guestLimit) {
    return Promise.reject('Event is full.');
  }
  //We are good to go.
  return database
    .ref('/invites')
    .push({
      id: newInvite.event.id,
      ...newInvite
    })
    .then(push => push.once('value'))
    .then(snap => {
      let invite = InviteModel({ id: snap.key, ...snap.val() });
      invite.eventId = snap.val().event;
      invite = invite.setEvent(newInvite);
      return invite;
    });
};

/**
 * Pushes a new PassModel to /passes.
 * @param {PassModel} newPass a PassModel.
 */
const pushPassToDB = newPass => {
  return database
    .ref('passes')
    .push(newPass)
    .then(pass => pass.once('value'))
    .then(snap =>
      PassModel({
        id: snap.key,
        ...snap.val()
      })
    );
};

//TODO change to be a firebase function
/**
 * This fucntion returns a promise to a valid pass (if the invite was valid).
 * We check if the user already has a pass for the event if they do we get that one.
 * If they don't we use the invite and push that new pass to the db
 * 
 * @param invite The invite that we want to exchange for a pass.
 * @returns PassModel
 */
export const exchangeInviteForPass = async (invite, userId) => {
  const { event } = invite;
  console.log('given invite:', invite);
  //Lets check if the user already has a pass for the event
  const usersPass = await database
    .ref('/')
    .child('passes')
    .orderByChild('user')
    .equalTo(`${userId}`)
    .once('value')
    .then(snap => snap.val())
    .then(passes => {
      if (!passes) {
        return null;
      }

      Object.keys(passes)
        .map(k => {
          passes[k]['id'] = k;
          return passes[k];
        })
        .filter(p => p.event === event.id);
    })
    .then(f => f && f[0]);

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
    return Promise.reject('Invite already used');
  }
  //use invite
  await database.ref(`invites/${invite.id}`).update({ isUsed: true });
  //The invite is valid lets get a new pass
  return pushPassToDB({
    desc: event.desc,
    isActive: false,
    isUsed: false,
    additionalInvitesLeft: 2,
    user: userId,
    event: event.id
  });
};

export const loginViaFirebase = loginMethod => {
  let provider;

  if (loginMethod === constants.GOOGLE_AUTH) {
    provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/user.birthday.read');
  } else {
    provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
  }

  auth.signInWithRedirect(provider);
};

export const signOutViaFirebase = () => {
  return auth.signOut();
};
