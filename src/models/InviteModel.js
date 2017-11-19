export default ({ id, event, claimedByUser, isUsed, ...rest }) => ({
  id,
  eventId: event,
  event: null,
  claimedByUser,
  isUsed,
  setEvent(e) {
    return { ...this, event: e };
  }
});
