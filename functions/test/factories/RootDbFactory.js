const EventFactory = require('./EventFactory');

const fakeUserId = 'randomUserId';

const defaultValues = () => {
  return {
    fakeEvent: EventFactory({key: null, _obj: {}}),
    fakeInviteId: null,
    fakeInvite: {}
  };
};

module.exports = (options) => {
  let { fakeInviteId, fakeInvite, fakeEvent } = {...defaultValues(), ...options};

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

  const childOnceEventFn = {
    once: jest.fn((q) => Promise.resolve(fakeEvent)),
  };

  const childUserInvitesFn = {
    once: jest.fn((q) => Promise.resolve((!fakeInviteId) ? null : {
      val: jest.fn(q => fakeInviteId)
    })),
  };

  const fakeRootDb = {
    child: jest.fn(childName => {
      if (childName === `/invites/${fakeInviteId}`) {
        return childInviteIdFn;
      } else if (childName === `/events/${fakeEvent.key}/spotsLeft`) {
        return childSpotsLeftFn;
      } else if (childName === '/invites') {
        return childInviteFn;
      } else if (childName === `/events/${fakeEvent.key}`) {
        return childOnceEventFn;
      } else if (childName === `/users/${fakeUserId}/events/${fakeEvent.key}/invite`) {
        return childUserInvitesFn;
      } else {
        return null;
      }
    })
  };

  return fakeRootDb;
};