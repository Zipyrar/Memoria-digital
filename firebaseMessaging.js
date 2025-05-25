importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyApToF1NNoR1aTuVx8xEReU00ZqG5KB8HM",
  authDomain: "memoria-digital.firebaseapp.com",
  databaseURL: "https://memoria-digital-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "memoria-digital",
  storageBucket: "memoria-digital.firebasedorage.app",
  messagingSenderId: "191151140032",
  appId: "1:191151140032:web:52a518f4103ff8af779125",
  measurementId: "G-G7XNP4N3NX"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'images/post-it.png' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
