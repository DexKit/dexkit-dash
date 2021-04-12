import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import {history} from './redux/store';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-notifications-component/dist/theme.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-table/react-table.css';

import './shared/styles/index.css';
import './assets/vendors/country-flag/sprite-flags-24x24.css';
import App from './App';
import '@crema/services';
import { 
  getPushNotificationToken, 
  // messaging 
} from '@crema/services/auth/firebase/firebase';

import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { onNotification, addNotification} from 'services/notification';


ReactGA.initialize(process.env.REACT_APP_ANALYTICS || '');

history.listen((his: any) => {
    ReactGA.pageview(his.pathname + his.search);
});


ReactDOM.render(<App />, document.getElementById('root'));



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
const onSucessRegistration = (registration: ServiceWorkerRegistration): void => {
  getPushNotificationToken(registration)
    .then(token => {
      console.log('token notification', token);
      // messaging.onBackgroundMessage((payload) => {
      //   console.log('Received background message ', payload);
      // });
    })
};

const broadcast = new BroadcastChannel('push-notification-channel');

// Listen to the response
broadcast.onmessage = (event) => {
  console.log('app event', event);
  const {
    data: {
      type,
      payload
    }
  }: { data: { type: string, payload: any }} = event;
  if(type === 'PUSH_NOTIFICATION'){
    addNotification(payload);
  }
};

serviceWorkerRegistration.register({
  onSuccess: onSucessRegistration,
  onUpdate: onSucessRegistration
});

onNotification((payload) => {
  console.log('messaging received with focus', payload);
  addNotification(payload);
})

// messaging.onMessage((payload) => {
//   console.log('messaging received with focus', payload);
// });