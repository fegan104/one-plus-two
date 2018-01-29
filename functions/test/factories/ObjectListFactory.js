module.exports = (objects = []) => {
  let list = [];

  objects.forEach(item => {
    list.push(item);
  });

  Object.defineProperty(list, 'push', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: (newElement) => {
      list.push(newElement);
    }
  });

  Object.defineProperty(list, 'numChildren', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: () => {
      return list.length;
    }
  });

  Object.defineProperty(list, 'val', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: () => {
      let result = {};

      list.forEach(item => {
        result[item.key] = item.val();
      });

      return result;
    }
  });

  return list;
};