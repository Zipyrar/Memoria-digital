// Importar el firebase.
import { database } from '../firebaseConfig.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar que se recargue la página.

        // Obtener los valores del formulario.
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim();

        // Comprobar si alguno de los elementos obligatorios están vacíos.
        if (!title || !date || !time) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        // Crear el objeto de recordatorio
        const newReminder = {
            title,
            date,
            time,
            description: description || 'Sin descripción'
        };

        // Guardar el nuevo recordatorio en Firebase
        const remindersRef = ref(database, 'recordatorios');
        push(remindersRef, newReminder).then(() => {
            alert('Recordatorio guardado');
            form.reset();  // Reiniciar formulario
        }).catch((error) => {
            console.error("Error guardando el recordatorio:", error);
        });
    });
});