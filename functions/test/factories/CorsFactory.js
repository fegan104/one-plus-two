jest.mock('cors');
const cors = require('cors');
cors.mockImplementation((setup) => {
  return (req, res, callback) => {
    callback();
  };
});