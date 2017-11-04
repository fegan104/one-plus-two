export const MOCK_SIGN_IN = 'MOCK_SIGN_IN';

const MOCK_USER = {
  id: 'userId0',
  email: 'mock@user.com',
  name: 'Mock User',
  profileData: { bio: "I'm not real" },
  oath: { data: 'oath data' }
};

export const mockSignIn = () => {
  // return new Promise(resolve =>
  //   setTimeout(resolve(MOCK_USER), 2000))
  return {
    type: MOCK_SIGN_IN,
    payload: Promise.resolve(MOCK_USER)
  };
};
