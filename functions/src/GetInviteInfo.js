const cors = require('cors')({ origin: true });

const GetInviteInfo = (functions, admin) => {
  return functions.https.onRequest((req, res) => {
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
};

module.exports = GetInviteInfo;