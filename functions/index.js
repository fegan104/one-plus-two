const functions = require('firebase-functions');
const admin = require('firebase-admin');

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