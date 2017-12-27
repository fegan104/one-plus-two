const RootDbFactory = require('./factories/RootDbFactory');
const EventFactory = require('./factories/EventFactory');
const CorsFactory = require('./factories/CorsFactory');
const FirebaseFactory = require('./factories/FirebaseFactory');

const myFunctions = require('../index.js');
const admin = require('firebase-admin');

describe('Cloud function', () => {
  beforeEach(() => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent1',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2,
        owners: [] // randomUserId
      }
    });

    const fakeInvite = {
      additionalInvitesLeft: 10
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = RootDbFactory({fakeEvent, fakeInviteId, fakeInvite});


    Object.defineProperty(admin, 'database', {
      get: () => (() => ({ ref: () => {return fakeRootDb;} }))
    });
  });

  // TODO: test owner, no owner with invite, no owner without an invite, no owner with invalid invite
  test('returns a 303 redirect', done => {
    // Use mock requests and mock responses to assert the function works as expected
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
            console.log(msg);
            done();
          },
          json: (msg) => {
            expect(msg.event).toEqual('fakeEvent1');
            console.log(msg);
            done();
          }
        };
      },
      redirect: (code, path) => {
        console.log(`redirect(${code}, ${path}) was called`);
        expect(code).toEqual(303);
        expect(path).toEqual('/messages');
        done();
      }
    };
    myFunctions.generateNewInvite(mockRequest, mockResponse);
  });
});