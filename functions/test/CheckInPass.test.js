const RootDbFactory = require('./factories/RootDbFactory');
const ModelFactory = require('./factories/ModelFactory');
const EventFactory = ModelFactory('event');
const PassFactory = ModelFactory('pass');
const UserFactory = ModelFactory('user');
const CorsFactory = require('./factories/CorsFactory');
const FirebaseFactory = require('./factories/FirebaseFactory');

const myFunctions = require('../index.js');
const admin = require('firebase-admin');

describe('Cloud function CheckInPass', () => {
  describe('Basic validation', () => {
    beforeEach(() => {
      const fakePass = PassFactory({
        key: 'fakePass1',
        _obj: {
          event: 'fakeEventId1',
          isUsed: false,
          user: 'fakeLuckyUser'
        }
      });

      const fakeRootDb = RootDbFactory({fakePass});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    test('Pass does not exist', done => {
      const mockRequest = {
        query: {
          passId: 'wrongfakePass1'
        },
        get: jest.fn(param => {
          if (param == 'Authorization') {
            return 'Bearer fAkEttttoken';
          }
        })
      };

      const mockResponse = {
        status: (code) => {
          return {
            send: (msg) => {
              expect(code).toEqual(404);
              expect(msg.text).toEqual('Pass not found.');
              done();
            }
          };
        }
      };

      myFunctions.checkInPass(mockRequest, mockResponse);
    });

    test('Invalid bearer token => Unauthorized user', done => {
      const mockRequest = {
        query: {
          passId: 'fakePass1'
        },
        get: jest.fn(param => {
          if (param == 'Authorization') {
            return 'Bearer wrongToken';
          }
        })
      };

      const mockResponse = {
        status: (code) => {
          return {
            send: (msg) => {
              expect(code).toEqual(401);
              expect(msg).toEqual('Unauthorized');
              done();
            }
          };
        }
      };

      myFunctions.checkInPass(mockRequest, mockResponse);
    });

    test('User is not owner of event', done => {
      const mockRequest = {
        query: {
          passId: 'fakePass1'
        },
        get: jest.fn(param => {
          if (param == 'Authorization') {
            return 'Bearer fAkEttttoken';
          }
        })
      };

      const mockResponse = {
        status: (code) => {
          return {
            send: (msg) => {
              expect(code).toEqual(401);
              expect(msg.text).toEqual('You are not an event admin.');
              done();
            }
          };
        }
      };

      myFunctions.checkInPass(mockRequest, mockResponse);
    });

  });

  describe('Proper data', () => {
    beforeEach(() => {
      const fakePass = PassFactory({
        key: 'fakePass1',
        _obj: {
          event: 'fakeEventId1',
          isUsed: false,
          user: 'fakeLuckyUser'
        }
      });

      const fakeEvent = EventFactory({
        key: 'fakeEventId1',
        _obj: {
          owners: {
            randomUserId: true
          }
        }
      });

      const fakeUser = UserFactory({
        key: 'fakeLuckyUser',
        _obj: {
          displayName: 'Fake John King',
          email: 'test@example.com'
        }
      });

      const fakeRootDb = RootDbFactory({fakePass, fakeUser, fakeEvent});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    test('Successfully checks-in a pass', done => {
      const mockRequest = {
        query: {
          passId: 'fakePass1'
        },
        get: jest.fn(param => {
          if (param == 'Authorization') {
            return 'Bearer fAkEttttoken';
          }
        })
      };

      const mockResponse = {
        status: (code) => {
          return {
            send: async (msg) => {
              let obj = await admin.database().ref().child('/passes/fakePass1').once('value');

              expect(code).toEqual(200);
              expect(obj.val().isUsed).toEqual(true);
              expect(obj.val().user).toEqual('fakeLuckyUser');
              expect(msg.user.displayName).toEqual('Fake John King');
              expect(msg.user.email).toEqual('test@example.com');
              done();
            }
          };
        }
      };

      myFunctions.checkInPass(mockRequest, mockResponse);
    });


  });


  describe('Proper data, but used invite', () => {
    beforeEach(() => {
      const fakePass = PassFactory({
        key: 'fakePass1',
        _obj: {
          event: 'fakeEventId1',
          isUsed: true,
          user: 'fakeLuckyUser'
        }
      });

      const fakeEvent = EventFactory({
        key: 'fakeEventId1',
        _obj: {
          owners: {
            randomUserId: true
          }
        }
      });

      const fakeUser = UserFactory({
        key: 'fakeLuckyUser',
        _obj: {
          displayName: 'Fake John King',
          email: 'test@example.com'
        }
      });

      const fakeRootDb = RootDbFactory({fakePass, fakeUser, fakeEvent});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    test('Pass was already used', done => {
      const mockRequest = {
        query: {
          passId: 'fakePass1'
        },
        get: jest.fn(param => {
          if (param == 'Authorization') {
            return 'Bearer fAkEttttoken';
          }
        })
      };

      const mockResponse = {
        status: (code) => {
          return {
            send: (msg) => {
              expect(code).toEqual(403);
              expect(msg.text).toEqual('Pass has been used by Fake John King.');
              done();
            }
          };
        }
      };

      myFunctions.checkInPass(mockRequest, mockResponse);
    });


  });
});