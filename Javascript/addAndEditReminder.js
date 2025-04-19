// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, push, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const btnSubmit = form.querySelector('button[type="submit"]');

    // Rellenar campos si hay edición en curso.
    const editingKey = localStorage.getItem('editingKey');
    if (editingKey) {
        const title = localStorage.getItem('editingTitle') || '';
        const date = localStorage.getItem('editingDate') || '';
        const time = localStorage.getItem('editingTime') || '';
        const description = localStorage.getItem('editingDescription') || '';

        document.getElementById('titulo').value = title;
        document.getElementById('fecha').value = date;
        document.getElementById('tiempo').value = time;
        document.getElementById('descripcion').value = description;

        btnSubmit.textContent = 'Actualizar';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener todos los datos del recordatorio.
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim() || 'Sin descripción';

        // Comprobar que no están vacíos.
        if (!title || !date || !time) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        const reminderData = { title, date, time, description };

        if (editingKey) {
            const reminderRef = ref(database, `recordatorios/${editingKey}`);
            update(reminderRef, reminderData)
                .then(() => {
                    alert('Recordatorio actualizado');
                    form.reset();
                    btnSubmit.textContent = 'Añadir';

                    // Limpiar estado de edición.
                    localStorage.removeItem('editingKey');
                    localStorage.removeItem('editingTitle');
                    localStorage.removeItem('editingDate');
                    localStorage.removeItem('editingTime');
                    localStorage.removeItem('editingDescription');

                    location.reload(); // Actualizar lista.
                })
                .catch((error) => {
                    console.error('Error actualizando:', error);
                });
        } else {
            const remindersRef = ref(database, 'recordatorios');
            push(remindersRef, reminderData)
                .then(() => {
                    alert('Recordatorio guardado');
                    form.reset();
                })
                .catch((error) => {
                    console.error('Error guardando:', error);
                });
        }
    });
});
