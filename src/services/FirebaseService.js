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

export const getUserData = userId => {
  return new Promise((resolve, reject) => {
    database
      .ref(`/users/${userId}`)
      .once('value')
      .then(dbObj => {
        if (!dbObj) {
          return resolve(null);
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

export const whateverUseForNewInvite = inviteId => {
  return new Promise((resolve, reject) => {
    auth.currentUser.getToken().then(token => {
      let endpoint = `${process.env
        .REACT_APP_FIREBASE_FUNCTIONS_ENDPOINT}/getInviteInfo?inviteId=${inviteId}`;

      fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(json => {
          let invite = InviteModel({ ...json });
          invite.setEvent(json.event);

          resolve(invite);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};

/**
 * When you push an invite to firebase you use up one of your 
 * invites left (unless you're an owner or the guest limit is reached),
 * and you get a link to the invite that can then be shared to anyone. This is also where
 * self enrollment can be done. TODO maybe make this a cloud function.
 * @param {Invite} newInvite 
 * @param userId of the inviter
 */
export const pushInviteToDB = async (newInvite, event, userId) => {
  /*

  // check if owner
  const isOwnerPromise = database
    .ref(`/events/${event.id}/owners`)
    .once('value')
    .then(snap => snap.val())
    .then(owners => owners[userId])
    .catch(err => {
      console.error(err);
      return false;
    });

  //Get a promise to the user's pass for the event
  const userPassPromise = database
    .ref('/')
    .child('passes')
    .orderByChild('user')
    .equalTo(userId)
    .once('value')
    .then(snap => snap.val())
    .then(passes => {
      if (!passes) {
        return null;
      }

      return Object.keys(passes)
        .map(k => {
          passes[k]['id'] = k;
          return passes[k];
        })
        .filter(p => p.event === event.id);
    })
    .then(f => f && f[0])
    .catch(err => {
      console.error(err);
      return null;
    });

  let [isOwner, userPass] = await Promise.all([
    isOwnerPromise,
    userPassPromise
  ]);
  console.log('userPass:', userPass);

  //If you aren't an owner and don't have invites left reject
  if (!isOwner && !(userPass && userPass.additionalInvitesLeft > 0)) {
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
  //We are good to add the invite and decrement the sharer's additionInvitesLeft
  if (!isOwner) {
    await database
      .ref(`/passes/${userPass.id}/additionalInvitesLeft`)
      .transaction(left => {
        return (left || 0) - 1;
      });
  }



  */

  return database
    .ref('/invites')
    .push({
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
