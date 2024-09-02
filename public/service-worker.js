// public/service-worker.js

importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBVDa3agi4C26EEskfNvKlPCiX_FMEulF4",
    authDomain: "pos-coffee-c5073.firebaseapp.com",
    databaseURL: "https://pos-coffee-c5073-default-rtdb.firebaseio.com",
    projectId: "pos-coffee-c5073",
    storageBucket: "pos-coffee-c5073.appspot.com",
    messagingSenderId: "760378748042",
    appId: "1:760378748042:web:b53d08225f849155605173"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(title, options);
});