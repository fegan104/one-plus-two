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
  id,
  desc,
  guestLimit,
  isSelfEnrollable,
  location,
  newsFeed: [], // TODO
  owners,
  picture,
  stats,
  title,
  dateTime
});
