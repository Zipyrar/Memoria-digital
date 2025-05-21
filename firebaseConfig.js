// Importar funciones necesarias de Firebase SDK.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging.js";

// Configuración de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyApToF1NNoR1aTuVx8xEReU00ZqG5KB8HM",
  authDomain: "memoria-digital.firebaseapp.com",
  databaseURL: "https://memoria-digital-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "memoria-digital",
  storageBucket: "memoria-digital.firebasestorage.app",
  messagingSenderId: "191151140032",
  appId: "1:191151140032:web:52a518f4103ff8af779125",
  measurementId: "G-G7XNP4N3NX"
};

// Iniciar Firebase.
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const messaging = getMessaging(app);

// Registrar el Service Worker para recibir notificaciones en segundo plano.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
  .then((registration) => {
    console.log('Service Worker registrado con éxito:', registration);

    // Solicitar permiso para notificaciones.
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Permiso para notificaciones concedido.');

        // Obtener token para enviar notificaciones a este cliente.
        getToken(messaging, { vapidKey: 'BOxMYcDkgjmFfzpMzr-cecrQ7kvZQ5RgPO5vj6VIYLIfwVVaurBIzkRBkBReYgwhdRvvgFTrKnuPv2szqpgvuaY', serviceWorkerRegistration: registration })
          .then((currentToken) => {
            if (currentToken) {
              console.log('Token FCM:', currentToken);
            } else {
              console.log('No se pudo obtener el token.');
            }
          })
          .catch((err) => {
            console.error('Error al obtener token FCM:', err);
          });
      } else {
        console.log('Permiso para notificaciones denegado.');
      }
    });
  })
  .catch((err) => {
    console.error('Error al registrar Service Worker:', err);
  });
}

// Escuchar mensajes cuando la app está en primer plano.
onMessage(messaging, (payload) => {
  console.log('Mensaje recibido en primer plano:', payload);
});

export { database };