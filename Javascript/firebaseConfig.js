// Importar lo necesario.
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyApToF1NNoR1aTuVx8xEReU00ZqG5KB8HM",
  authDomain: "memoria-digital.firebaseapp.com",
  projectId: "memoria-digital",
  storageBucket: "memoria-digital.firebasestorage.app",
  messagingSenderId: "191151140032",
  appId: "1:191151140032:web:52a518f4103ff8af779125",
  measurementId: "G-G7XNP4N3NX",
  databaseURL: "https://memoria-digital-default-rtdb.firebaseio.com/"
};

// Iniciar Firebase.
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); 

export { database };