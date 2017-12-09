const UpdateEventOwners = (functions, admin) => { 
  return functions.database.ref('/events/{eventId}/owners').onWrite(event => {
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
};

module.exports = UpdateEventOwners;