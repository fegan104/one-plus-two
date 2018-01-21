const myFunctions = require('../src/InviteUtil');
const RootDbFactory = require('./factories/RootDbFactory');
const ModelFactory = require('./factories/ModelFactory');
const EventFactory = ModelFactory('event');
const FirebaseFactory = require('./factories/FirebaseFactory');


describe('buildInviteAndUpdateEventAsInvitee', () => {
  test('creates an invite', () => {
    
    const fakeEvent = EventFactory({
      key: 'fakeEvent1',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      }
    });

    const fakeInvite = {
      additionalInvitesLeft: 10
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = RootDbFactory({fakeEvent, fakeInviteId, fakeInvite});

    return myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId).then(result => {
      expect(result.id).toEqual('randomInviteKey');
      expect(result.event).toEqual(fakeEvent.key);
      expect(result.additionalInvitesLeft).toEqual(0); 
      expect(fakeEvent._obj.spotsLeft).toEqual(48);
      expect(fakeInvite.additionalInvitesLeft).toEqual(9);
    });
  });

  test('fails to creates an invite with additionalInvitesLeft=0', async () => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent2',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      }
    });

    const fakeInvite = {
      additionalInvitesLeft: 0
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = RootDbFactory({fakeEvent, fakeInviteId, fakeInvite});

    await expect(myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId)).rejects.toMatch('no more invites');
  });

  test('fails to creates an invite with spotsLeft=0', async () => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent3',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 0,
        isSelfEnrollable: false,
        canBringXPeople: 2
      }
    });

    const fakeInvite = {
      additionalInvitesLeft: 2
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = RootDbFactory({fakeEvent, fakeInviteId, fakeInvite});

    await expect(myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId)).rejects.toMatch('no more space');
  });
});

describe('buildInviteAndUpdateEventAsOwner', () => {
  test('creates an invite with additionalInvitesLeft=canBringXPeople', () => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent2',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      }
    });

    const fakeRootDb = RootDbFactory({fakeEvent});

    return myFunctions.buildInviteAndUpdateEventAsOwner(fakeRootDb, fakeEvent).then(result => {
      expect(result.id).toEqual('randomInviteKey');
      expect(result.event).toEqual(fakeEvent.key);
      expect(result.additionalInvitesLeft).toEqual(fakeEvent._obj.canBringXPeople); 
      expect(fakeEvent._obj.spotsLeft).toEqual(48);
    });
  });

  test('fails to creates an invite with spotsLeft=0', async () => {
    const fakeEvent = EventFactory({
      key: 'fakeEvent3',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 0,
        isSelfEnrollable: false,
        canBringXPeople: 2
      }
    });


    const fakeRootDb = RootDbFactory({fakeEvent});

    await expect(myFunctions.buildInviteAndUpdateEventAsOwner(fakeRootDb, fakeEvent)).rejects.toMatch('no more space');
  });
});