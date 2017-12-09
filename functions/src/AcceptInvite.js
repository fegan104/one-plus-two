const AcceptInvite = (functions, admin) => {
  return functions.database.ref('/invites/{inviteId}').onUpdate(event => {
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

    let updateInvitePromise = new Promise((resolve, reject) => {
      rootDb
        .child(`/users/${userId}`)
        .once('value')
        .then(dbObj => {
          const user = dbObj.val();

          const userDemographics = {
            gender: user.gender,
            age: user.age
          };

          rootDb
            .child(`/invites/${event.params.inviteId}`)
            .update({ isUsed: true, userDemographics: userDemographics})
            .then(final => {
              resolve(final);
            }); 
        })
        .catch(error => {
          reject(error);
        });
    });

    return Promise.all([
      otherTablesPromise,
      updateInvitePromise
    ]);
  });
};

module.exports = AcceptInvite;