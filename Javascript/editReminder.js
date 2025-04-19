// Importar lo de Firebase.
import { database } from '../firebaseConfig.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Variable para la clave del recordatorio que se está editando.
let currentEditingKey = null;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga de página.

        if (currentEditingKey) {
            // Obtener valores del formulario.
            const title = document.getElementById('titulo').value.trim();
            const date = document.getElementById('fecha').value;
            const time = document.getElementById('tiempo').value;
            const description = document.getElementById('descripcion').value.trim();

            // Actualizar el recordatorio en Firebase.
            const reminderRef = ref(database, `recordatorios/${currentEditingKey}`);
            update(reminderRef, {
                title,
                date,
                time,
                description: description || 'Sin descripción'
            }).then(() => {
                alert('Recordatorio actualizado');
                form.reset(); // Reiniciar formulario.
                currentEditingKey = null; // Limpiar clave de edición.
            }).catch((error) => {
                console.error("Error actualizando el recordatorio:", error);
            });
        }
    });
});
