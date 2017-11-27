export default ({
  id,
  event,
  additionalInvitesLeft,
  claimedByUser,
  isUsed,
  ...rest
}) => ({
  id,
  eventId: event,
  event: null,
  additionalInvitesLeft,
  claimedByUser,
  isUsed,
  setEvent(e) {
    return { ...this, event: e };
  }
});
