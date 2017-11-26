const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);

exports.acceptInvite = functions.database.ref('/invites/{inviteId}').onUpdate(event => {
  const userId = event.data.child('claimedByUser').val();
  const eventId = event.data.child('event').val();
  const isUsed = event.data.child('isUsed').val();
  const rootDb = admin.database().ref();

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

    console.log('inviteid - ' + req.query.inviteId);

    rootDb
      .child(`/invites/${req.query.inviteId}`)
      .once('value')
      .then(dbObj => {
        if (!dbObj) {
          res.status(200).end();
          return;
        } 

        console.log('qqq', dbObj);
        console.log(dbObj.val());

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
            let fullEvent = obj.val();
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
    });
  });
});

exports.whatever = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        const rootDb = admin.database().ref();

        res.status(200).end();
      })
      .catch((err) => {
        res.status(401).send(err); 
      });
  });
});