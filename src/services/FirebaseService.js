import * as firebase from 'firebase';
import '@firebase/messaging';
import EventModel from '../models/EventModel';
import InviteModel from '../models/InviteModel';
import PassModel from '../models/PassModel';
import constants from '../constants';

// eslint-disable-next-line
let database;
let auth;
let messaging;

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
    messaging = firebase.messaging();
    messaging.onMessage(payload => {
      console.log('message received.');
      const { title, body } = payload.notification;
      new Notification(title, { body });
    });
  }

  if (auth && authCallback) {
    auth.onAuthStateChanged(user => {
      authCallback(user);
    });
  }
};

export const getUserData = userId => {
  return new Promise((resolve, reject) => {
    database
      .ref(`/users/${userId}`)
      .once('value')
      .then(dbObj => {
        if (!dbObj) {
          return resolve({});
        }

        return resolve(dbObj.val());
      })
      .catch(error => {
        reject(error);
      });
  });
};

/**
 * Returns a Promise to an array of EventModels from firebase.
 */
export const getEventsDB = eventIds => {
  return Promise.all(
    eventIds.map(id => {
      return getEventFromDB(id);
    })
  );
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
        const eventVal = dbObj.val();
        // const newsFeed = Object.keys(eventVal.newsFeed).map(k => eventVal.newsFeed[k]);
        let event = EventModel({ id: dbObj.key, /*newsFeed,*/ ...eventVal });

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
  console.log(newEvent);
  return new Promise((resolve, reject) => {
    database
      .ref('/events')
      .push(newEvent)
      .then(push => push.once('value'))
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

export const getInviteInfoFromCloudFunction = inviteId => {
  return new Promise((resolve, reject) => {
    let endpoint = `${process.env
      .REACT_APP_FIREBASE_FUNCTIONS_ENDPOINT}/getInviteInfo?inviteId=${inviteId}`;

    fetch(endpoint, { headers: { 'Content-Type': 'application/json' } })
      .then(res => res.json())
      .then(json => {
        let invite = InviteModel({ ...json, event: json.event.id });
        resolve(invite.setEvent(json.event));
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const generateInviteCloudFunction = eventId => {
  return new Promise((resolve, reject) => {
    auth.currentUser.getToken().then(token => {
      let endpoint = `${process.env
        .REACT_APP_FIREBASE_FUNCTIONS_ENDPOINT}/generateNewInvite?eventId=${eventId}`;

      fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
        //mode: 'no-cors'
      })
        .then(res => res.json())
        .then(json => {
          let invite = InviteModel({ ...json, event: json.event.id });
          resolve(invite.setEvent(json.event));
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};

export const acceptInviteInDB = (inviteId, eventId, userId) => {
  return new Promise((resolve, reject) => {
    database
      .ref(`/invites/${inviteId}`)
      .update({ claimedByUser: userId })
      .then(dbObj => {
        if (!dbObj) {
          return resolve(null);
        }

        database
          .ref(`/users/${userId}/events/${eventId}/pass`)
          .once('child_changed')
          .then(snap => {
            return resolve(PassModel({ id: snap.key, ...snap.val() }));
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
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

export const claimPassInDB = passId => {
  if (!passId) {
    return Promise.reject(console.error);
  }

  return database
    .ref(`/passes/${passId}`)
    .update({ isUsed: true })
    .catch(console.error);
};

export const getFCMToken = user => {
  // Get Instance ID token. Initially this makes a network call, once retrieved
  // subsequent calls to getToken will return from cache.
  return messaging
    .requestPermission()
    .then(_ => {
      console.log('Notification permission granted.');
      // Retrieve an Instance ID token for use with FCM.
      return messaging.getToken();
    })
    .then(currentToken => {
      if (currentToken) {
        console.log('successfully registered fcm token.', currentToken);
        database.ref(`/users/${user.id}`).update({ fcmToken: currentToken });
        return { ...user, fcmToken: currentToken };
      } else {
        // Show permission request.
        console.log(
          'No Instance ID token available. Request permission to generate one.'
        );
        return user;
      }
    })
    .catch(err => {
      console.log('Unable to get permission to notify.', err);
      return user;
    });
};

export const pushMessageToDB = (eventId, body) => {
  return database
    .ref(`/events/${eventId}/newsFeed`)
    .push({
      title: 'Title',
      body
    })
    .once('value')
    .then(snap => snap.val())
    .catch(console.error);
};
