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
  desc: desc || null,
  guestLimit: guestLimit || null,
  spotsLeft: spotsLeft || null,
  isSelfEnrollable: isSelfEnrollable || false,
  canBringXPeople: canBringXPeople || 1,
  location: location || null,
  newsFeed: [], // TODO
  owners: owners || [],
  picture: picture || null,
  stats: stats || null,
  title: title || null,
  dateTime: dateTime || null
});
