export default ({
  id,
  desc,
  guestLimit,
  spotsLeft,
  isSelfEnrollable,
  canBringXPeople,
  location,
  owners,
  newsFeed,
  picture,
  title,
  dateTime,
  importFrom,
  ...rest
}) => ({
  id: id || null,
  desc: desc || '',
  guestLimit: guestLimit || 1,
  spotsLeft: spotsLeft || 1,
  isSelfEnrollable: isSelfEnrollable || false,
  canBringXPeople: canBringXPeople || 2,
  location: location || '',
  newsFeed: newsFeed || [],
  owners: owners || {},
  picture: picture || '',
  title: title || '',
  importFrom: importFrom,
  dateTime: dateTime || ''
});
