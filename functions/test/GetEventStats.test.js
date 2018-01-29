const RootDbFactory = require('./factories/RootDbFactory');
const ModelFactory = require('./factories/ModelFactory');
const EventFactory = ModelFactory('event');
const PassFactory = ModelFactory('pass');
const InviteFactory = ModelFactory('invite');
const UserFactory = ModelFactory('user');
const CorsFactory = require('./factories/CorsFactory');
const FirebaseFactory = require('./factories/FirebaseFactory');
const ObjectListFactory = require('./factories/ObjectListFactory');

const myFunctions = require('../index.js');
const admin = require('firebase-admin');

describe('Cloud function GetEventStats', () => {
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

    test('Event does not exist', done => {
      const mockRequest = {
        query: {
          eventId: 'wrongfakeEvent1'
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
              expect(msg.text).toEqual('Event not found.');
              done();
            }
          };
        }
      };

      myFunctions.getEventStats(mockRequest, mockResponse);
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

      myFunctions.getEventStats(mockRequest, mockResponse);
    });

    test('User is not owner of event', done => {
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
              expect(msg.text).toEqual('You are not an event admin.');
              done();
            }
          };
        }
      };

      myFunctions.getEventStats(mockRequest, mockResponse);
    });

  });

  describe('Proper data', () => {
    beforeEach(() => {
      const fakePass1 = PassFactory({
        key: 'fakePass1',
        _obj: {
          event: 'fakeEvent1',
          isUsed: true,
          checkedInAt: 'my fav time'
        }
      });

      const fakePass2 = PassFactory({
        key: 'fakePass2',
        _obj: {
          event: 'fakeEvent1',
          isUsed: false
        }
      });

      const fakeInvite1 = InviteFactory({
        key: 'fakeInvite1',
        _obj: {
          event: 'fakeEvent1',
          isUsed: true,
          userDemographics: {
            gender: 'female',
            age: 20
          }
        }
      });

      const fakeInvite2 = InviteFactory({
        key: 'fakeInvite2',
        _obj: {
          event: 'fakeEvent1',
          isUsed: true,
          userDemographics: {
            gender: '',
            age: 24
          }
        }
      });

      const fakeInvite3 = InviteFactory({
        key: 'fakeInvite3',
        _obj: {
          event: 'fakeEvent1',
          isUsed: false
        }
      });

      const fakeInvite4 = InviteFactory({
        key: 'fakeInvite4',
        _obj: {
          event: 'wrongEventNotToCount'
        }
      });

      const fakeInvitesList = ObjectListFactory([fakeInvite1, fakeInvite2, fakeInvite3, fakeInvite4]);
      const fakePassesList = ObjectListFactory([fakePass1, fakePass2]);

      const fakeEvent = EventFactory({
        key: 'fakeEvent1',
        _obj: {
          owners: {
            randomUserId: true
          }
        }
      });

      const fakeRootDb = RootDbFactory({fakeEvent, fakeInvitesList, fakePassesList});

      Object.defineProperty(admin, 'database', {
        get: () => (() => ({ ref: () => { return fakeRootDb; } }))
      });
    });

    test.only('Calculate event statistics', done => {
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
            json: (json) => {
              expect(code).toEqual(200);
              expect(json.totalInvites).toEqual(3);
              expect(json.acceptedInvites).toEqual(2);
              expect(json.usedPasses).toEqual(1);
              expect(json.averageAge).toEqual(22);
              expect(json.genderStats.female).toEqual(1);
              expect(json.genderStats.na).toEqual(1);
              expect(json.checkInTimes[0]).toEqual('my fav time');

              done();
            }
          };
        }
      };

      myFunctions.getEventStats(mockRequest, mockResponse);
    });


  });
});