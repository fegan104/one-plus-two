const InviteUtil = require('./InviteUtil.js');
const EmailUtil = require('./EmailUtil.js');

const ImportGuests = (functions, admin) => {
  return functions.database.ref('/events/{eventId}').onCreate(fbEvent => {
    const event = fbEvent.data.val();
    if (event.importFrom) {
      emailInviteToGuests(event.importFrom, admin, functions)
    }
  })
}

const emailInviteToGuests = (eventId, admin, functions) => {
  const rootDb = admin.database().ref();

  let data = {};
  return admin.database()
    .ref(`/events/${eventId}`)
    .once('value')
    // .then(snap => snap.val())
    .then(e => { data["event"] = e })
    .then(_ => queryGuestsForEvent(eventId, admin))
    .then(guests => {
      data["guests"] = guests;
      const invitePromises = [];
      guests.forEach(g => {
        invitePromises.push(InviteUtil.buildInviteAndUpdateEventAsOwner(rootDb, data.event))
      })
      return Promise.all(invitePromises)
    })
    .then(invites => {
      invites.forEach((invite, index) => {
        sendEmailToGuest(invite, data.guests[index].val(), data.event.val(), functions)
      })
    })
    .catch(console.error)
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
    .then(guests => Array.from(new Set(guests)))
    .then(guests => {
      let guestPromises = [];
      guests.forEach(g => {
        console.log("filtered guest:", g)
        guestPromises.push(admin.database().ref(`/users/${g}`).once('value'));
      });
      return Promise.all(guestPromises);
    })
    .catch(console.error)
}

const sendEmailToGuest = (invite, guest, event, functions) => {
  const APP_NAME = "OnePlusTwo"

  const mailOptions = {
    from: `${APP_NAME} <OnePlusTwoMQP@gmail.com.com>`,
    to: guest.email
  };
  // The user subscribed to the newsletter.
  mailOptions.subject = `You've been invited to ${event.title}`;
  mailOptions.text = `Claim you invitation at https://www.one-plus-two.com/invite/${invite.id}`;
  return EmailUtil(functions).sendMail(mailOptions).then(_ => {
    console.log('New invite email sent to:', guest.email);
  }).catch(console.error);
}

module.exports = ImportGuests;