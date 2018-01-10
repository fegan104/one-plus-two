module.exports = (object = {}) => {
  let event = {
    key: object.key || null,
    _obj: object._obj || {},
    val: jest.fn(() => { 
      return event._obj;
    })
  };
  return event;
};