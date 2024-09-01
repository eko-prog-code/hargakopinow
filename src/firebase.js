// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBVDa3agi4C26EEskfNvKlPCiX_FMEulF4",
    authDomain: "pos-coffee-c5073.firebaseapp.com",
    databaseURL: "https://pos-coffee-c5073-default-rtdb.firebaseio.com",
    projectId: "pos-coffee-c5073",
    storageBucket: "pos-coffee-c5073.appspot.com",
    messagingSenderId: "760378748042",
    appId: "1:760378748042:web:b53d08225f849155605173"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
