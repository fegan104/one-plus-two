const admin = require('firebase-admin');
const functions = require('firebase-functions');

functions.config = jest.fn(() => ({
  firebase: {
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://not-a-project.firebaseio.com',
    storageBucket: 'not-a-project.appspot.com'
  }
}));

admin.auth = jest.fn(() => ({
  verifyIdToken: jest.fn(token => {
  	if (token === 'fAkEttttoken') {
  	  return Promise.resolve({
  	  	uid: 'randomUserId'
  	  });
  	}
  })
}));