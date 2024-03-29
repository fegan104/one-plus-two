const ModelFactory = require('./ModelFactory');
const EventFactory = ModelFactory('event');
const PassFactory = ModelFactory('pass');
const UserFactory = ModelFactory('user');
const InviteFactory = ModelFactory('invite');
const ObjectListFactory = require('./ObjectListFactory');

const fakeUserId = 'randomUserId';

const defaultValues = () => {
  return {
    fakeEvent: EventFactory(),
    fakePass: PassFactory(),
    fakeUser: UserFactory(),
    fakeInvite: InviteFactory(),
    fakeInvitesList: ObjectListFactory(),
    fakePassesList: ObjectListFactory()
  };
};

const updatableChild = (fakeObj) => {
  return {
    once: jest.fn((q) => Promise.resolve(fakeObj)),
    update: jest.fn(val => {
      Object.keys(val).forEach(key => {
        fakeObj._obj[key] = val[key];
      });

      return Promise.resolve();
    })
  };
};

const filteringChild = (originalCollection) => {
  return {
    orderByChild: jest.fn(param => {
      return {
        equalTo: jest.fn(valueToEqual => {
          return {
            once: jest.fn(q => {
              let filteredCollection = originalCollection.filter(elem => elem._obj[param] === valueToEqual);
              let newList = ObjectListFactory(filteredCollection);

              return Promise.resolve(newList);
            })
          };
        })
      };
    })
  };
}

module.exports = (options) => {
  let { fakeInvite, fakeEvent, fakePass, fakeUser, fakeInvitesList, fakePassesList } = {...defaultValues(), ...options};

  const childSpotsLeftFn = {
    set: jest.fn(val => {
      fakeEvent._obj.spotsLeft = val;
      return Promise.resolve();
    })
  };

  const childInvitesFn = {
    ...filteringChild(fakeInvitesList),
    push: jest.fn(val => {
      return Promise.resolve({
        once: jest.fn(q => {
          return Promise.resolve({
            key: 'randomInviteKey',
            val: jest.fn(() => val)
          });
        })
      })
    })
  };

  const childPassesFn = {
    ...filteringChild(fakePassesList)
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
        return updatableChild(fakeInvite);
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
      } else if ((testVar = childName.match(/^\/events\/(.*)$/g))) {
        if (childName.split('events/')[1] === fakeEvent.key) {
          return updatableChild(fakeEvent);
        } else {
          return { once: jest.fn((q) => Promise.resolve(EventFactory())) };
        }
      } else if (childName === `/users/${fakeUser.key}`) {
        return updatableChild(fakeUser);
      } else if (childName === `/users/${fakeUserId}/events/${fakeEvent.key}/invite`) {
        return childUserInvitesFn;
      } else if ((testVar = childName.match(/^\/passes\/(.*)$/g))) {
        if (childName.split('passes/')[1] === fakePass.key) {
          return updatableChild(fakePass);
        } else {
          return { once: jest.fn((q) => Promise.resolve(PassFactory())) };
        }
      } else if (childName === '/passes') {
        return childPassesFn;
      } else {
        return { once: jest.fn((q) => Promise.resolve(null)) };
      }
    })
  };

  return fakeRootDb;
};