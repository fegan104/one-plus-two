const cors = require('cors')({ origin: true });

const GetEventStats = (functions, admin) => { 
  return functions.https.onRequest((req, res) => {
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
            .then(dbObj => {
              if (!dbObj.val()) {
                res.status(404).send({text: 'Event not found.'});
                return;
              }

              const event = dbObj.val();

              if (!(event && event.owners && event.owners[uid])) {
                res.status(401).send({text: 'You are not an event admin.'});
                return;
              }

              let totalInvites = 0;
              let acceptedInvites = 0;
              let usedPasses = 0;

              let genderStats = { male: 0, female: 0, na: 0};
              let ageSum = 0;
              let ageCount = 0;

              let checkInTimes = [];

              let invitesPromise = new Promise((resolve, reject) => {
                rootDb
                  .child('/invites')
                  .orderByChild('event')
                  .equalTo(eventId)
                  .once('value')
                  .then(snapshot => {
                    totalInvites = snapshot.numChildren();

                    let invites = snapshot.val();

                    Object.keys(invites).forEach(key => {
                      let invite = invites[key];

                      if (invite.isUsed) {
                        acceptedInvites += 1;

                        if (!invite.userDemographics) {
                          genderStats['na'] += 1;
                          return;
                        }

                        if (invite.userDemographics.gender === 'male') {
                          genderStats['male'] += 1;
                        } else if (invite.userDemographics.gender === 'female') {
                          genderStats['female'] += 1;
                        } else {
                          genderStats['na'] += 1;
                        }

                        if (invite.userDemographics.age > 0) {
                          ageSum += invite.userDemographics.age;
                          ageCount += 1;
                        }
                      }
                    })

                    resolve();
                  })
                  .catch(error => {
                    reject(error);
                  });
              });

              let passesPromise = new Promise((resolve, reject) => {
                rootDb
                  .child('/passes')
                  .orderByChild('event')
                  .equalTo(eventId)
                  .once('value')
                  .then(snapshot => {
                    let passes = snapshot.val();
                    Object.keys(passes).forEach(key => {
                      let pass = passes[key];

                      if (pass.isUsed) {
                        usedPasses += 1;
                        
                        if (pass.checkedInAt) {
                          checkInTimes.push(pass.checkedInAt);
                        }
                      }
                    });

                    resolve();
                  })
                  .catch(error => {
                    reject(error);
                  });
              });


              Promise.all([invitesPromise, passesPromise])
                .then(() => {
                  res.status(200).json({
                    totalInvites,
                    acceptedInvites,
                    usedPasses,
                    genderStats,
                    averageAge: (ageCount > 0) ? (ageSum / ageCount) : 0,
                    checkInTimes
                  });
                });
              
            })
            .catch(error => {
              console.log(error);
              res.status(404).send({text: 'Event not found'});
            });
        })
        .catch((err) => {
          res.status(401).send(err);
        });
    });
  });
};

module.exports = GetEventStats;