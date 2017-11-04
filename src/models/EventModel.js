export default (
  id,
  desc,
  guestLimit,
  isSelfEnrollable,
  location,
  picture,
  stats,
  title,
  dateTime
) => ({
  id: id,
  desc: desc,
  guestLimit: guestLimit,
  isSelfEnrollable: isSelfEnrollable,
  location: location,
  newsFeed: [],
  owners: [],
  picture: picture,
  stats: stats,
  title: title,
  dateTime: dateTime
});
