// src/firebase/fcm.js
import { messaging } from './firebase';  // Ensure import from the updated firebase.js
import { getToken, onMessage } from 'firebase/messaging';

export const requestForToken = async () => {
  let currentToken = '';

  try {
    currentToken = await getToken(messaging, { vapidKey: 'BElzKWWnIdi06E7lom6XoYkb7bNExsy72y7-PFNdoZYT5CGMqm_8i9qm0YhvDYyUHo9WacNdI1F5OOJLEmmZ4Fs' });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      // Save this token to your server, or use it to send notifications to this client
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      resolve(payload);
    });
  });
