
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.7/firebase-messaging.js');

const  firebaseConfig  = {
  apiKey: 'AIzaSyCR8YGE_cE1Mp04FNKOD5AHze0eIzc2Va4',
  authDomain: 'dexkit-7da19.firebaseapp.com',
  projectId: 'dexkit-7da19',
  storageBucket: 'dexkit-7da19.appspot.com',
  messagingSenderId: '421890595152',
  appId: '1:421890595152:web:724f2c9a4fe1f57127b455',
  measurementId: 'G-5JEQM5123H'
};
const app = firebase.default.initializeApp(firebaseConfig);
const messaging = firebase.default.messaging(app);
const broadcast = new BroadcastChannel('push-notification-channel');

broadcast.onmessage = (event) => {
  console.log('firebase sw message event', event.data.payload);
  if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
    broadcast.postMessage({ payload: 1});
  }
};

messaging.onBackgroundMessage(function (payload) {
  console.log(`Received background message ${new Date()}`, payload);
  broadcast.postMessage({
    type: 'PUSH_NOTIFICATION',
    payload
  });
  console.log('registration', self.registration);
  // self.registration.sync.register('nova notificação');
}, undefined, () => console.log('conclusion: self', self));