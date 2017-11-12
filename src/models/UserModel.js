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
  providerData
});
