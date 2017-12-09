import * as firebase from 'firebase';
import '@firebase/messaging';
import EventModel from '../models/EventModel';
import InviteModel from '../models/InviteModel';
import PassModel from '../models/PassModel';
import UserModel from '../models/UserModel';
import constants from '../constants';

// eslint-disable-next-line
let database;
let auth;
let messaging;

const getAge = dateString => {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const cloudEndpoint = url => {
  return new Promise((resolve, reject) => {
    auth.currentUser.getToken().then(token => {
      let endpoint = `${
        process.env.REACT_APP_FIREBASE_FUNCTIONS_ENDPOINT
      }/${url}`;

      fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
        //mode: 'no-cors'
      }).then(response => {
        if (!response.ok) {
          response.json().then(json => {
            reject(json);
          });
          return;
        }

        const json = response.json();
        resolve(json);
      });
    });
  });
};

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
    auth.getRedirectResult().then(result => {
      if (
        result.credential &&
        result.additionalUserInfo.providerId === 'facebook.com'
      ) {
        const gender = result.additionalUserInfo.profile.gender;
        const birthday = result.additionalUserInfo.profile.birthday;
        const age = getAge(birthday);

        let genderPromise = database
          .ref(`/users/${result.user.uid}/gender`)
          .set(gender);
        let agePromise = database.ref(`/users/${result.user.uid}/age`).set(age);

        Promise.all([genderPromise, agePromise]).then(() => {
          authCallback(result.user);
        });
      }
    });

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
        if (!dbObj.val()) {
          console.error('no user data');
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
  const FAIL_TOKEN = Symbol('failed');

  let promises = eventIds.map(id => getEventFromDB(id));

  const resolvedPromises = Promise.all(
    promises.map(p => p.catch(e => FAIL_TOKEN))
  ).then(values => values.filter(v => v !== FAIL_TOKEN));

  return resolvedPromises;
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
        if (!dbObj.val()) {
          return reject('no such event');
        }

        const eventVal = dbObj.val();
        const newsFeed = eventVal.newsFeed
          ? Object.keys(eventVal.newsFeed).map(k => eventVal.newsFeed[k])
          : null;
        let event = EventModel({ id: dbObj.key, ...eventVal, newsFeed });

        return resolve(event);
      })
      .catch(error => {
        console.log(`catching at ${eventId}`);
        reject(error);
      });
  });
};

export const getPassFromDB = passId => {
  return database
    .ref(`/passes/${passId}`)
    .once('value')
    .then(snap => {
      return PassModel({ id: snap.key, ...snap.val() });
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
        if (!dbObj.val()) {
          return reject('something failed');
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
        if (!dbObj.val()) {
          return reject('no such invite');
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
    let endpoint = `${
      process.env.REACT_APP_FIREBASE_FUNCTIONS_ENDPOINT
    }/getInviteInfo?inviteId=${inviteId}`;

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
    cloudEndpoint(`generateNewInvite?eventId=${eventId}`)
      .then(json => {
        let invite = InviteModel({ ...json, event: json.event.id });
        resolve(invite.setEvent(json.event));
      })
      .catch(error => {
        reject(error);
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
          return reject('cannot claim');
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
    provider.addScope('public_profile');
  }

  auth.signInWithRedirect(provider);
};

export const signOutViaFirebase = () => {
  return auth.signOut();
};

export const checkInPassInDB = passId => {
  return new Promise((resolve, reject) => {
    cloudEndpoint(`checkInPass?passId=${passId}`)
      .then(json => {
        let user = UserModel({ ...json });
        resolve(user);
      })
      .catch(error => {
        reject(error);
      });
  });
};

export const monitorPassInDB = passId => {
  return database
    .ref(`/passes/${passId}`)
    .once('child_changed')
    .then(snap => getPassFromDB(passId));
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
        console.log('Successfully registered FCM token.', currentToken);
        database.ref(`/users/${user.id}`).update({ fcmToken: currentToken });
        return currentToken;
      } else {
        // Show permission request.
        console.log(
          'No Instance ID token available. Request permission to generate one.'
        );
        return null;
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
