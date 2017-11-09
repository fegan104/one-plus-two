import actionType from '../constants';

const MOCK_USER = {
  id: 'userId1',
  email: 'mock@user.com',
  name: 'Mock User',
  profileData: { bio: "I'm not real" }
};

export const mockSignIn = () => {
  return {
    type: actionType.MOCK_SIGN_IN,
    payload: Promise.resolve(MOCK_USER)
  };
};
