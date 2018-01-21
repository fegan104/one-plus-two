const cors = require('cors')({ origin: true });

const CheckInPass = (functions, admin) => { 
  return functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const tokenId = req.get('Authorization').split('Bearer ')[1];

      return admin.auth().verifyIdToken(tokenId)
        .then((decoded) => {
          const uid = decoded.uid;
          const passId = req.query.passId;
          const rootDb = admin.database().ref();

          console.log(uid, passId);

          rootDb
            .child(`/passes/${passId}`)
            .once('value')
            .then(dbObj => {
              if (!dbObj.val()) {
                res.status(404).send({text: 'Pass not found.'});
                return;
              }

              const pass = dbObj.val();

              rootDb
                .child(`/events/${pass.event}/owners/${uid}`)
                .once('value')
                .then(eventDb => {
                  if (!eventDb || !eventDb.val()) {
                    res.status(401).send({text: 'You are not an event admin.'});
                    return;
                  }
 
                  if (pass.isUsed) {
                    rootDb
                      .child(`/users/${pass.user}`)
                      .once('value')
                      .then(userDb => {
                        const user = userDb.val();

                        res.status(403).send({text: `Pass has been used by ${user.displayName || user.email || 'xxx'}.`});
                      });

                      return;
                  }
                  
                  rootDb
                    .child(`/passes/${passId}`)
                    .update({ isUsed: true, checkedInAt: new Date() })
                    .then(dbObj2 => {
                      rootDb
                        .child(`/users/${pass.user}`)
                        .once('value')
                        .then(userDb => {
                          const user = userDb.val();
                          const returnObj = {
                            displayName: user.displayName,
                            email: user.email
                          };

                          res.status(200).send({user: returnObj});
                        });
                    });
              });
            })
            .catch(error => {
              console.log(error);
              res.status(404).send({text: 'Pass not found'});
            });
        })
        .catch((err) => {
          res.status(401).send(err);
        });
    });
  });
};

module.exports = CheckInPass;