const RootDbFactory = require('./factories/RootDbFactory');
const ModelFactory = require('./factories/ModelFactory');
const EventFactory = ModelFactory('event');
const InviteFactory = ModelFactory('invite');
const CorsFactory = require('./factories/CorsFactory');
const FirebaseFactory = require('./factories/FirebaseFactory');

const myFunctions = require('../index.js');
const admin = require('firebase-admin');

describe('Cloud function GenerateNewInvite', () => {
  describe('Basic validation', () => {
    beforeEach(() => {
      const fakeEvent = EventFactory({
        key: 'fakeEvent1',
        _obj: {
          desc: 'test',
          guestLimit: 50,
          spotsLeft: 49,
          isSelfEnrollable: false,
          canBringXPeople: 2,
          owners: {} // randomUserId
        }
      });

      const fakeRootDb = RootDbFactory({fakeEvent});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    test('Invalid bearer token => Unauthorized user', done => {
      const mockRequest = {
        query: {
          eventId: 'fakeEvent1'
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

      myFunctions.generateNewInvite(mockRequest, mockResponse);
    });

    test('Event not found', done => {
      const mockRequest = {
        query: {
          eventId: 'wrongFakeEvent1'
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
            end: (msg) => {
              expect(code).toEqual(404);
              done();
            },
            send: (msg) => {
              console.log('aaa', msg);
              expect(code).toEqual(404);
              done();
            }
          };
        }
      };

      myFunctions.generateNewInvite(mockRequest, mockResponse);
    });

    test('Invitee cannot generate an invite without being invited', done => {
      const mockRequest = {
        query: {
          eventId: 'fakeEvent1'
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
            end: () => {
              expect(code).toEqual(401);
              done();
            }
          };
        }
      };

      myFunctions.generateNewInvite(mockRequest, mockResponse);
    });
  });

  describe('Proper data', () => {
    beforeEach(() => {
      const fakeEvent = EventFactory({
        key: 'fakeEvent1',
        _obj: {
          desc: 'test',
          guestLimit: 50,
          spotsLeft: 49,
          isSelfEnrollable: false,
          canBringXPeople: 2,
          owners: {} // randomUserId
        }
      });

      const fakeInvite = InviteFactory({
        key: 'testInviteId',
        _obj: {
          additionalInvitesLeft: 1
        }
      });

      const fakeRootDb = RootDbFactory({fakeEvent, fakeInvite});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    // TODO: test owner, no owner with invite, no owner with invalid invite
    test('Create a new invite', done => {
      const mockRequest = {
        query: {
          eventId: 'fakeEvent1'
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
            json: (msg) => {
              expect(msg.event).toEqual('fakeEvent1');
              done();
            },
          };
        }
      };

      myFunctions.generateNewInvite(mockRequest, mockResponse);
    });

    test('Fail to create two new invites (when only one is permitted)', async (done) => {
      const mockRequest = {
        query: {
          eventId: 'fakeEvent1'
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
              expect(msg).toEqual('no more invites');
              done();
            },
            json: (msg) => {
              expect(msg.event).toEqual('fakeEvent1');
            }
          };
        }
      };

      myFunctions.generateNewInvite(mockRequest, mockResponse);
      myFunctions.generateNewInvite(mockRequest, mockResponse)
    });

  });
});