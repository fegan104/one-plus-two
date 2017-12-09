export default ({
  uid,
  email,
  displayName,
  gender,
  age,
  photoURL,
  providerData,
  fcmToken,
  ...rest
}) => ({
  id: uid,
  email,
  name: displayName,
  gender,
  age,
  photoURL,
  providerData,
  events: null,
  fcmToken: fcmToken || '',
  setEvents(e) {
    return { ...this, events: e || {} };
  }
});
