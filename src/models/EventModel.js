export default ({
  id,
  desc,
  guestLimit,
  isSelfEnrollable,
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
  isSelfEnrollable: isSelfEnrollable || false,
  location: location || null,
  newsFeed: [], // TODO
  owners: owners || [],
  picture: picture || null,
  stats: stats || null,
  title: title || null,
  dateTime: dateTime || null
});
