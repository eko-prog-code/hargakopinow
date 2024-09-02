// Import scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyBVDa3agi4C26EEskfNvKlPCiX_FMEulF4",
  authDomain: "pos-coffee-c5073.firebaseapp.com",
  databaseURL: "https://pos-coffee-c5073-default-rtdb.firebaseio.com",
  projectId: "pos-coffee-c5073",
  storageBucket: "pos-coffee-c5073.appspot.com",
  messagingSenderId: "760378748042",
  appId: "1:760378748042:web:b53d08225f849155605173"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});