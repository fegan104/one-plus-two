export default ({
  id,
  desc,
  event,
  additionalInvitesLeft,
  isActive,
  isUsed,
  user,
  ...rest
}) => ({
  id,
  desc,
  event,
  additionalInvitesLeft,
  isActive,
  isUsed,
  user
});
