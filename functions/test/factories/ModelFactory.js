module.exports = (modelType) => {
  return (object = {}) => {
    let model = {
      key: object.key || null,
      _obj: object._obj || null,
      _type: modelType,
      val: jest.fn(() => { 
        return model._obj;
      })
    };
    return model;
  };
};