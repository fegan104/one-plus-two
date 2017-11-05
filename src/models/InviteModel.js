export default ({ id, event, isUsed, additionalInvitesLeft, ...rest }) => ({
  id,
  eventId: event,
  event: null,
  isUsed,
  additionalInvitesLeft,
  setEvent(e) {
    return { ...this, event: e };
  }
});
