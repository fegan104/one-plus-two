// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
const firebase = require('/__/firebase/3.9.0/firebase-app.js');
require('/__/firebase/3.9.0/firebase-messaging.js');
require('/__/firebase/init.js');

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.setBackgroundMessageHandler(payload => {
  console.log('[service-worker.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.'
  };

  // eslint-disable-line no-restricted-globals
  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
// then(registration => {
//   messaging.useServiceWorker(registration);
//   messaging.setBackgroundMessageHandler(payload => {
//     console.log('[sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.'
//     };

//     return registration.showNotification(
//       notificationTitle,
//       notificationOptions
//     );
//   });
// })