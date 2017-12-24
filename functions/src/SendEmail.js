const EmailUtil = require('./EmailUtil');

const emailUserMessage = ( user, event, message, functions ) => {
  const APP_NAME = "OnePlusTwo"

  const mailOptions = {
    from: `${APP_NAME} <OnePlusTwoMQP@gmail.com.com>`,
    to: user.email
  };
  // The user subscribed to the newsletter.
  mailOptions.subject = `New message posted in ${event.title}`;
  mailOptions.text = message.body;
  return EmailUtil(functions).sendMail(mailOptions).then(_ => {
    console.log('New welcome email sent to:', user.email);
  });
};

const SendEmail = (functions, admin) => {
  return functions.database.ref('/events/{eventId}/newsFeed/{messageId}').onCreate(event => {
    let guests = []

    admin.database().ref().child('passes')
      .orderByChild(`event`)//query all passes for event
      .equalTo(event.params.eventId)
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
      .then(guestSnaps => {//Now we have an array of user snapshots
        guests = guestSnaps.map(g => g.val())
        console.log("guests:", guests)
      })
      .then(_ => admin.database().ref(`/events/${event.params.eventId}`).once('value'))
      .then(eventSnap => {
        const eventData = eventSnap.val();
        const messageData = eventData.newsFeed[event.params.messageId];
        console.log("message data:", messageData);
        //promise all emails
        const emailPromises = []
        guests.forEach(g => {
          emailPromises.push(emailUserMessage(g, eventData, messageData, functions))
        })

        return Promise.all(emailPromises)
      });
  });
};

module.exports = SendEmail;