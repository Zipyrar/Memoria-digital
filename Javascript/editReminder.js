// Importar lo de Firebase.
import { database } from '../firebaseConfig.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim() || 'Sin descripción';

        // Usar lo que guardaste con localStorage
        const editingKey = localStorage.getItem('editingKey');

        if (editingKey) {
            // ACTUALIZAR
            const reminderRef = ref(database, `recordatorios/${editingKey}`);
            update(reminderRef, { title, date, time, description })
                .then(() => {
                    alert('Recordatorio actualizado');
                    form.reset();
                    localStorage.removeItem('editingKey');
                    location.reload();
                })
                .catch((error) => {
                    console.error("Error actualizando:", error);
                });
        } else {
            // CREAR
            const remindersRef = ref(database, 'recordatorios');
            push(remindersRef, { title, date, time, description })
                .then(() => {
                    alert('Nuevo recordatorio guardado');
                    form.reset();
                })
                .catch((error) => {
                    console.error("Error creando el recordatorio:", error);
                });
        }
    });
});
