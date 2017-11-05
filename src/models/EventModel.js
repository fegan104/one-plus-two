export default ({
  id,
  desc,
  guestLimit,
  isSelfEnrollable,
  location,
  picture,
  stats,
  title,
  dateTime,
  ...rest
}) => ({
  id,
  desc,
  guestLimit,
  isSelfEnrollable,
  location,
  newsFeed: [], // TODO
  owners: [], // TODO
  picture,
  stats,
  title,
  dateTime
});
