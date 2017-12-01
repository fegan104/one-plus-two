// import { event } from 'firebase-functions/lib/providers/analytics';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

exports.acceptInvite = functions.database.ref('/invites/{inviteId}').onUpdate(event => {
  const userId = event.data.child('claimedByUser').val();
  const eventId = event.data.child('event').val();
  const isUsed = event.data.child('isUsed').val();
  const rootDb = admin.database().ref()

  if (!userId || !eventId || isUsed) {
    return;
  }

  let passObj = {
    user: userId,
    event: eventId,
    isUsed: false
  };

  let otherTablesPromise = new Promise((resolve, reject) => {
    rootDb
      .child(`/users/${userId}/events/${eventId}/invite`)
      .set(event.params.inviteId)
      .then(req => {
        rootDb
          .child('passes')
          .push(passObj)
          .then(pass => pass.once('value'))
          .then(snap => {
            rootDb
              .child(`/users/${userId}/events/${eventId}/pass`)
              .set(snap.key)
              .then(final => {
                resolve(final);
              })
              .catch(error => {
                reject(error);
              });
          })
          .catch(error => {
            reject(error);
          });
      })
      .catch(error => {
        reject(error);
      });
  });

  let updateInvitePromise = event.data.ref.child('isUsed').set(true);

  return Promise.all([
    otherTablesPromise,
    updateInvitePromise
  ]);
});

/**
 * Triggers when a new message is added to an event's newsFeed. Then pushes a message to 
 * each user who has a pass for the event.
 */
exports.sendMessage = functions.database.ref('/events/{eventId}/newsFeed/{messageId}').onCreate(event => {
  const snap = event.data.val();
  //TODO add message contents to notification payload?
  const { eventId, messageId } = event.params;

  //There is no way promise more than 1 value so we'll accumulate them here
  let data = {};
  // Get the list of device tokens.
  return admin.database().ref('/')
    .child('passes')
    .orderByChild(`event`)//query all passes for event
    .equalTo(eventId)
    .once('value')
    .then(passes => Object.keys(passes).map(k => passes[k].user))
    .then(guests => {
      let guestPromises = []
      guests.forEach(g => {
        guestPromises.push(admin.database().ref(`/users/${g}`).child('fcmToken').once('value'));
      });
      return Promise.all(guestPromises);
    })
    .then(tokensSnap => {
      const tokens = tokensSnap.map(s => s.val());
      data.tokens = tokens;
    })
    .then(_ => admin.database().ref(`/events/${eventId}`).once('value'))
    .then(eventSnap => eventSnap.val().title)
    .then(eventName => {
      data.eventName = eventName;
    })
    .then(_ => {
      // Notification details.
      const text = snap.text;
      const payload = {
        notification: {
          title: `New message in ${data.eventName}`,
          body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : ''
        }
      };
      // Send notifications to all tokens.
      return admin.messaging().sendToDevice(data.tokens, payload).then(response => {
        // For each message check if there was an error.
        const tokensToRemove = [];
        response.results.forEach((result, index) => {
          const error = result.error;
          if (error) {
            console.error('Failure sending notification to', data.tokens[index], error);
            // Cleanup the tokens who are not registered anymore.
            // if (error.code === 'messaging/invalid-registration-token' ||
            // 	error.code === 'messaging/registration-token-not-registered') {
            // 	// tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
            // 	//TODO remove invalid tokens
            // }
          }
        });
        return Promise.all(tokensToRemove);
      });
    });

});

/**
 * Triggers whenever a new user signs up and add them to the db.
 */
exports.addUser = functions.auth.user().onCreate(event => {
  let user = event.data.val();
  return admin.database.ref(`/users/${user.uid}`).update(user)
})

exports.updateEventOwners = functions.database.ref('/events/{eventId}/owners').onWrite(event => {
  const eventId = event.params.eventId;
  const owners = event.data.val();
  const rootDb = admin.database().ref();

  let removeOwnershipFrom = [];
  let addOwnershipTo = [];

  if (event.data.previous.exists()) {
    let prevOwners = event.data.previous.val();

    Object.keys(prevOwners).forEach((userId) => {
      if (!owners[userId]) {
        removeOwnershipFrom.push(userId);
      }
    });

    Object.keys(owners).forEach((userId) => {
      if (!prevOwners[userId]) {
        addOwnershipTo.push(userId);
      }
    });
  } else {
    addOwnershipTo = Object.keys(owners);
  }

  let removeOwnershipPromise = Promise.all(removeOwnershipFrom.map((userId) => {
    rootDb
      .child(`/users/${userId}/events/${eventId}/isOwner`)
      .remove();
  }));

  let addOwnershipPromise = Promise.all(addOwnershipTo.map((userId) => {
    rootDb
      .child(`/users/${userId}/events/${eventId}/isOwner`)
      .set(true);
  }));

  return Promise.all([
    removeOwnershipPromise,
    addOwnershipPromise
  ]);
});

exports.getInviteInfo = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const rootDb = admin.database().ref();

    rootDb
      .child(`/invites/${req.query.inviteId}`)
      .once('value')
      .then(dbObj => {
        if (!dbObj) {
          res.status(200).end();
          return;
        }

        let invite = dbObj.val();
        invite.id = dbObj.key;

        rootDb
          .child(`/events/${invite.event}`)
          .once('value')
          .then(obj => {
            if (!obj) {
              res.status(200).end();
              return;
            }

            let newInvite = invite;
            const fullEvent = obj.val();
            let event = {
              id: obj.key,
              title: fullEvent.title,
              desc: fullEvent.desc,
              picture: fullEvent.picture,
              location: fullEvent.location,
              dateTime: fullEvent.dateTime
            };

            newInvite.event = event;
            res.status(200).json(newInvite);
          })
      })
      .catch(err => {
        res.status(404).send(err);
      });
  });
});

let decreaseSpotsLeft = (rootDb, eventObject) => {
  return new Promise((resolve, reject) => {
    let event = eventObject.val();

    if (event.spotsLeft !== null && event.spotsLeft === 0) {
      reject('no more space');
      return;
    }

    let spotsLeft = (event.spotsLeft || event.guestLimit);

    rootDb
      .child(`/events/${eventObject.key}/spotsLeft`)
      .set(spotsLeft > 0 ? spotsLeft - 1 : null)
      .then(snap => {
        resolve(snap);
      });
  });
};

let buildInvite = (rootDb, isOwner, eventObject) => {
  return new Promise((resolve, reject) => {
    const event = eventObject.val();
    const invite = {
      event: eventObject.key,
      additionalInvitesLeft: (!isOwner) ? 0 : (event.canBringXPeople || 0),
      claimedByUser: null,
      isUsed: false
    };

    rootDb
      .child('/invites')
      .push(invite)
      .then(snap => snap.once('value'))
      .then(snap => {
        console.log('aaa', snap);
        let newInvite = snap.val();
        newInvite.id = snap.key;

        resolve(newInvite);
      });
  });
};

let buildInviteAndUpdateEvent = (rootDb, eventObject, createViaOldInvite = null) => {
  return new Promise((resolve, reject) => {
    if (createViaOldInvite) {
      rootDb
        .child(`/invites/${createViaOldInvite}`)
        .once('value')
        .then(snap => {
          const oldInvite = snap.val();

          if (oldInvite.additionalInvitesLeft > 0) {
            oldInvite
              .set({ additionalInvitesLeft: oldInvite.additionalInvitesLeft - 1 })
              .then(q => decreaseSpotsLeft(rootDb, eventObject))
              .then(q => buildInvite(rootDb, false, eventObject))
              .then(newInvite => {
                resolve(newInvite);
              })
              .catch(error => reject(error));
          } else {
            reject('no more invites');
          }
        })
    } else {
      decreaseSpotsLeft(rootDb, eventObject)
        .then(q => buildInvite(rootDb, true, eventObject))
        .then(newInvite => {
          resolve(newInvite);
        })
        .catch(error => reject(error));
    }
  });
};

let buildInviteAndUpdateEventAsOwner = (rootDb, eventObject) => {
  return buildInviteAndUpdateEvent(rootDb, eventObject, null);
};


let buildInviteAndUpdateEventAsInvitee = (rootDb, eventObject, createViaOldInvite) => {
  return buildInviteAndUpdateEvent(rootDb, eventObject, createViaOldInvite);
};

exports.generateNewInvite = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        const uid = decoded.uid;
        const eventId = req.query.eventId;
        const rootDb = admin.database().ref();

        console.log(uid, eventId);

        rootDb
          .child(`/events/${eventId}`)
          .once('value')
          .then(eventObj => {
            if (!eventObj) {
              res.status(200).end();
              return;
            }

            const event = eventObj.val();

            if (event.owners[uid] === true) {
              buildInviteAndUpdateEventAsOwner(rootDb, eventObj)
                .then(invite => {
                  res.status(200).json(invite);
                  return;
                });
            } else {
              rootDb
                .child(`/users/${uid}/events/${eventId}/invite`)
                .once('value')
                .then(oldInviteDbObj => {
                  if (!oldInviteDbObj) {
                    res.status(401).end();
                    return;
                  }

                  buildInviteAndUpdateEventAsInvitee(rootDb, eventObj, oldInviteDbObj.val())
                    .then(invite => {
                      res.status(200).json(invite);
                      return;
                    });
                });
            }
          })
          .catch(error => {
            console.log(error);
            res.status(404).send(error);
          });
      })
      .catch((err) => {
        res.status(401).send(err);
      });
  });
});
