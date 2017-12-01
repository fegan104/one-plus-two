// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts('/__/firebase/4.6.2/firebase-app.js');
importScripts('/__/firebase/4.6.2/firebase-messaging.js');
importScripts('/__/firebase/init.js');

const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
messaging.setBackgroundMessageHandler(payload => {
  console.log('[service-worker.js] Received background message ', payload);
  // Customize notification here
  const { title, body } = payload.notification;

  // eslint-disable-line no-restricted-globals
  return self.registration.showNotification(title, { body });
});
