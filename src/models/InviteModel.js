export default ({ id, event, isUsed, ...rest }) => ({
  id,
  eventId: event,
  event: null,
  isUsed,
  setEvent(e) {
    return { ...this, event: e };
  }
});
