const InviteUtil = require('./src/InviteUtil');

const ImportGuests = (functions, admin) => {
  return functions.database.ref('/events/{eventId}').onCreate(fbEvent => {
    const event = fbEvent.data.val();
    if (event.importFrom) {
      emailInviteToGuests(event.importFrom, admin)
    }
  })
}

const emailInviteToGuests = (event, admin) => {
  const rootDb = admin.database().ref();

  return queryGuestsForEvent(event.id, admin)
    .then(guests => {
      const invitePromises = [];
      guests.forEach(g => {
        invitePromises.push(InviteUtil.buildInviteAndUpdateEventAsOwner(rootDb, event))
      })
      return Promise.all(invitePromises)
    })
}

const queryGuestsForEvent = (eventId, admin) => {
  return admin.database().ref().child('passes')
    .orderByChild('event')//query all passes for event
    .equalTo(eventId)
    .once('value')
    .then(passesSnap => {
      const passes = passesSnap.val();
      return Object.keys(passes).map(k => passes[k].user);
    })
    .then(guests => {
      console.log("guests:", guests);
      let guestPromises = []
      guests.forEach(g => {
        guestPromises.push(admin.database().ref(`/users/${g}`).once('value'));
      });
      return Promise.all(guestPromises);
    })
}

module.exports = ImportGuests;