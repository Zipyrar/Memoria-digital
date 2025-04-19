// Importar las funciones necesarias de los SDKs de Firebase.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

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

// Inicializar Firebase.
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Exportar base de datos.
export { database };