const cors = require('cors')({ origin: true });

const GetEventStats = (functions, admin) => { 
  /*return functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      return admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          const uid = decoded.uid;
          const eventId = req.query.eventId;
          const rootDb = admin.database().ref();

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
  });*/
};

module.exports = GetEventStats;