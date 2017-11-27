export default ({
  id,
  desc,
  guestLimit,
  spotsLeft,
  isSelfEnrollable,
  canBringXPeople,
  location,
  owners,
  picture,
  stats,
  title,
  dateTime,
  ...rest
}) => ({
  id: id || null,
  desc: desc || '',
  guestLimit: guestLimit || 1,
  spotsLeft: spotsLeft || 1,
  isSelfEnrollable: isSelfEnrollable || false,
  canBringXPeople: canBringXPeople || 1,
  location: location || '',
  newsFeed: [], // TODO
  owners: owners || {},
  picture: picture || '',
  stats: stats || {},
  title: title || '',
  dateTime: dateTime || ''
});
