const ModelFactory = require('./ModelFactory');
const EventFactory = ModelFactory('event');
const PassFactory = ModelFactory('pass');
const UserFactory = ModelFactory('user');
const InviteFactory = ModelFactory('invite');

const fakeUserId = 'randomUserId';

const defaultValues = () => {
  return {
    fakeEvent: EventFactory(),
    fakePass: PassFactory(),
    fakeUser: UserFactory(),
    fakeInvite: InviteFactory()
  };
};

module.exports = (options) => {
  let { fakeInvite, fakeEvent, fakePass, fakeUser } = {...defaultValues(), ...options};

  const childInviteFn = {
    once: jest.fn((q) => Promise.resolve(fakeInvite)),
    update: jest.fn(val => {
      Object.keys(val).forEach(key => {
        fakeInvite._obj[key] = val[key];
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

  const childInvitesFn = {
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

  const childOnceUserFn = {
    once: jest.fn((q) => Promise.resolve(fakeUser)),
  };

  const childOncePassFn = {
    once: jest.fn((q) => Promise.resolve(fakePass)),
    update: jest.fn(val => {
      Object.keys(val).forEach(key => {
        fakePass._obj[key] = val[key];
      });

      return Promise.resolve();
    })
  };

  const childUserInvitesFn = {
    once: jest.fn((q) => Promise.resolve((!fakeInvite.key) ? null : {
      val: jest.fn(q => fakeInvite.key)
    })),
  };

  const fakeRootDb = {
    child: jest.fn(childName => {
      let testVar;

      if (childName === `/invites/${fakeInvite.key}`) {
        return childInviteFn;
      } else if (childName === `/events/${fakeEvent.key}/spotsLeft`) {
        return childSpotsLeftFn;
      } else if ((testVar = childName.match(/^\/events\/(.*)\/owners\/(.*)$/g))) {
        if (childName.match(fakeEvent.key) && fakeEvent._obj.owners && fakeEvent._obj.owners[childName.split('owners/')[1]]) {
          return { once: jest.fn((q) => Promise.resolve({val: jest.fn(() => true)})) };
        } else {
          return { once: jest.fn((q) => Promise.resolve(null)) };
        }
      } else if (childName === '/invites') {
        return childInvitesFn;
      } else if (childName === `/events/${fakeEvent.key}`) {
        return childOnceEventFn;
      } else if (childName === `/users/${fakeUser.key}`) {
        return childOnceUserFn;
      } else if (childName === `/users/${fakeUserId}/events/${fakeEvent.key}/invite`) {
        return childUserInvitesFn;
      } else if ((testVar = childName.match(/^\/passes\/(.*)$/g))) {
        if (childName.split('passes/')[1] === fakePass.key) {
          return childOncePassFn;
        } else {
          return { once: jest.fn((q) => Promise.resolve(PassFactory())) };
        }
      } else {
        return { once: jest.fn((q) => Promise.resolve(null)) };
      }
    })
  };

  return fakeRootDb;
};