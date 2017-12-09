const cors = require('cors')({ origin: true });

const decreaseSpotsLeft = (rootDb, eventObject) => {
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

const buildInvite = (rootDb, isOwner, eventObject) => {
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

const buildInviteAndUpdateEvent = (rootDb, eventObject, createViaOldInvite = null) => {
  return new Promise((resolve, reject) => {
    if (createViaOldInvite) {
      rootDb
        .child(`/invites/${createViaOldInvite}`)
        .once('value')
        .then(snap => {
          const oldInvite = snap.val();

          if (oldInvite.additionalInvitesLeft > 0) {
            rootDb
              .child(`/invites/${createViaOldInvite}`)
              .update({ additionalInvitesLeft: oldInvite.additionalInvitesLeft - 1 })
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

const buildInviteAndUpdateEventAsOwner = (rootDb, eventObject) => {
  return buildInviteAndUpdateEvent(rootDb, eventObject, null);
};


const buildInviteAndUpdateEventAsInvitee = (rootDb, eventObject, createViaOldInvite) => {
  return buildInviteAndUpdateEvent(rootDb, eventObject, createViaOldInvite);
};

const GenerateNewInvite = (functions, admin) => { 
  return functions.https.onRequest((req, res) => {
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
};

module.exports = GenerateNewInvite;