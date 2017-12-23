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

module.exports = {
  buildInviteAndUpdateEventAsOwner,
  buildInviteAndUpdateEventAsInvitee
}