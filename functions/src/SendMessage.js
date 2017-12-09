const SendMessage = (functions, admin) => {
  return functions.database.ref('/events/{eventId}/newsFeed/{messageId}').onCreate(event => {
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
      .then(passesSnap => {
        const passes = passesSnap.val();
        return Object.keys(passes).map(k => passes[k].user);
      })
      .then(guests => {
        console.log("guests:", guests);
        let guestPromises = []
        guests.forEach(g => {
          guestPromises.push(admin.database().ref(`/users/${g}`).child('fcmToken').once('value'));
        });
        return Promise.all(guestPromises);
      })
      .then(tokensSnap => {
        const tokens = tokensSnap.map(s => s.val());
        console.log("data:", data);
        data.tokens = tokens;
      })
      .then(_ => admin.database().ref(`/events/${eventId}`).once('value'))
      .then(eventSnap => eventSnap.val().title)
      .then(eventName => {
        data.eventName = eventName;
        console.log("data:", data);
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
        console.log("sending to tokens:", data.tokens);
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
};

module.exports = SendMessage;