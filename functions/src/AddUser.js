const AddUser = (functions, admin) => {
  return functions.auth.user().onCreate(event => {
    let user = event.data;
    return admin.database.ref(`/users/${user.uid}`).update(user)
  });
};

module.exports = AddUser;
