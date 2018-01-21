const RootDbFactory = require('./factories/RootDbFactory');
const ModelFactory = require('./factories/ModelFactory');
const EventFactory = ModelFactory('event');
const InviteFactory = ModelFactory('invite');
const CorsFactory = require('./factories/CorsFactory');
const FirebaseFactory = require('./factories/FirebaseFactory');

const myFunctions = require('../index.js');
const admin = require('firebase-admin');

describe('Cloud function GetEventInfo', () => {
  beforeEach(() => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent1',
      _obj: {
        desc: 'test',
        title: 'this is a long test title',
        picture: 'url here',
        location: 'Starbucks',
        dateTime: 'time',
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
        additionalInvitesLeft: 1,
        event: 'fakeEvent1'
      }
    });

    const fakeRootDb = RootDbFactory({fakeEvent, fakeInvite});

    Object.defineProperty(admin, 'database', {
      get: () => (() => ({ ref: () => { return fakeRootDb; } }))
    });
  });

  // TODO: test owner, no owner with invite, no owner with invalid invite
  test('Returns a proper result', done => {
    const mockRequest = {
      query: {
        inviteId: 'testInviteId'
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
            expect(msg.id).toEqual('testInviteId');
            expect(msg.event.desc).toEqual('test');
            expect(msg.event.title).toEqual('this is a long test title');
            expect(msg.event.picture).toEqual('url here');
            expect(msg.event.location).toEqual('Starbucks');
            expect(msg.event.dateTime).toEqual('time');
            done();
          }
        };
      }
    };

    myFunctions.getInviteInfo(mockRequest, mockResponse);
  });
});