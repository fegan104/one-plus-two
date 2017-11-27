export default ({
  uid,
  email,
  displayName,
  photoURL,
  providerData,
  fcmToken,
  ...rest
}) => ({
  id: uid,
  email,
  name: displayName,
  photoURL,
  providerData,
  events: null,
  fcmToken: fcmToken || '',
  setEvents(e) {
    return { ...this, events: e || {} };
  }
});
