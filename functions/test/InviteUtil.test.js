const admin = require('firebase-admin');
const functions = require('firebase-functions');

functions.config = jest.fn(() => ({
  firebase: {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com'
  }
}));

const myFunctions = require('../src/InviteUtil');


const buildRootDb = (fakeEvent, fakeInviteId, fakeInvite) => {
  const childInviteIdFn = {
    once: jest.fn((q) => Promise.resolve({
      val: jest.fn(() => fakeInvite)
    })),
    update: jest.fn(val => {
      Object.keys(val).forEach(key => {
        fakeInvite[key] = val[key];
      });

      return Promise.resolve();
    })
  };

  const childSpotsLeftFn = {
    set: jest.fn(val => {
      fakeEvent._obj.spotsLeft = val;
      return Promise.resolve();
    })
  };

  const childInviteFn = {
    push: jest.fn(val => {
      return Promise.resolve({
        once: jest.fn(q => {
          if (q == 'value') {
            return Promise.resolve({
              key: 'randomInviteKey',
              val: jest.fn(() => val)
            });
          }
        })
      })
    })
  };

  const fakeRootDb = {
    child: jest.fn(childName => {
      if (childName == `/invites/${fakeInviteId}`) {
        return childInviteIdFn;
      } else if (childName == `/events/${fakeEvent.key}/spotsLeft`) {
        return childSpotsLeftFn;
      } else if (childName == '/invites') {
        return childInviteFn;
      } else {
        return null;
      }
    })
  };

  return fakeRootDb;
};


describe('buildInviteAndUpdateEventAsInvitee', () => {
  test('creates an invite', () => {
    const fakeEvent = {
      key: 'fakeEvent1',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      },
      val: jest.fn(() => { 
        return fakeEvent._obj;
      })
    };

    const fakeInvite = {
      additionalInvitesLeft: 10
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = buildRootDb(fakeEvent, fakeInviteId, fakeInvite);

    return myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId).then(result => {
      expect(result.id).toEqual('randomInviteKey');
      expect(result.event).toEqual(fakeEvent.key);
      expect(result.additionalInvitesLeft).toEqual(0); 
      expect(fakeEvent._obj.spotsLeft).toEqual(48);
      expect(fakeInvite.additionalInvitesLeft).toEqual(9);
    });
  });

  test('fails to creates an invite with additionalInvitesLeft=0', async () => {
    const fakeEvent = {
      key: 'fakeEvent2',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      },
      val: jest.fn(() => { 
        return fakeEvent._obj;
      })
    };

    const fakeInvite = {
      additionalInvitesLeft: 0
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = buildRootDb(fakeEvent, fakeInviteId, fakeInvite);

    await expect(myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId)).rejects.toMatch('no more invites');
  });

  test('fails to creates an invite with spotsLeft=0', async () => {
    const fakeEvent = {
      key: 'fakeEvent3',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 0,
        isSelfEnrollable: false,
        canBringXPeople: 2
      },
      val: jest.fn(() => { 
        return fakeEvent._obj;
      })
    };

    const fakeInvite = {
      additionalInvitesLeft: 2
    };
    const fakeInviteId = 'testInviteId';


    const fakeRootDb = buildRootDb(fakeEvent, fakeInviteId, fakeInvite);

    await expect(myFunctions.buildInviteAndUpdateEventAsInvitee(fakeRootDb, fakeEvent, fakeInviteId)).rejects.toMatch('no more space');
  });
});

describe('buildInviteAndUpdateEventAsOwner', () => {
  test('creates an invite with additionalInvitesLeft=canBringXPeople', () => {
    const fakeEvent = {
      key: 'fakeEvent1',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 49,
        isSelfEnrollable: false,
        canBringXPeople: 2
      },
      val: jest.fn(() => { 
        return fakeEvent._obj;
      })
    };

    const fakeRootDb = buildRootDb(fakeEvent, null, {});

    return myFunctions.buildInviteAndUpdateEventAsOwner(fakeRootDb, fakeEvent).then(result => {
      expect(result.id).toEqual('randomInviteKey');
      expect(result.event).toEqual(fakeEvent.key);
      expect(result.additionalInvitesLeft).toEqual(fakeEvent._obj.canBringXPeople); 
      expect(fakeEvent._obj.spotsLeft).toEqual(48);
    });
  });

  test('fails to creates an invite with spotsLeft=0', async () => {
    const fakeEvent = {
      key: 'fakeEvent3',
      _obj: {
        desc: 'test',
        guestLimit: 50,
        spotsLeft: 0,
        isSelfEnrollable: false,
        canBringXPeople: 2
      },
      val: jest.fn(() => { 
        return fakeEvent._obj;
      })
    };


    const fakeRootDb = buildRootDb(fakeEvent, null, {});

    await expect(myFunctions.buildInviteAndUpdateEventAsOwner(fakeRootDb, fakeEvent)).rejects.toMatch('no more space');
  });
});