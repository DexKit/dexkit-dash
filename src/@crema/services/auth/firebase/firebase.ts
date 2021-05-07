import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/firebase-messaging';
// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


// const analytics = firebase.analytics();
const auth = firebase.auth();
//const messaging = firebase.messaging();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const getPushNotificationToken = async (serviceWorkerRegistration?: ServiceWorkerRegistration) => {
  const item = localStorage.getItem('notification-token');
  /*const token = item == null || item?.length == 0 ?
    await messaging.getToken({
      vapidKey: process.env.REACT_APP_FIREBASE_VAPIDKEY,
      // serviceWorkerRegistration
    }) : item;*/
 /* console.log('token', token);
  localStorage.setItem('notification-token', token);*/
  return '';
}

export {
  auth,
 // messaging,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider,
  getPushNotificationToken
  // analytics
};
