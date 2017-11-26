export default ({
  uid,
  email,
  displayName,
  photoURL,
  providerData,
  ...rest
}) => ({
  id: uid,
  email,
  name: displayName,
  photoURL,
  providerData,
  events: null,
  setEvents(e) {
    return { ...this, events: e || {} };
  }
});
