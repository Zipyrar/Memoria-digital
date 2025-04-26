// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, push, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const btnSubmit = form.querySelector('button[type="submit"]');
    const btnCancel = document.getElementById('cancelar-edicion');

    // Rellenar campos si hay edición en curso.
    const editingKey = localStorage.getItem('editingKey');
    if (editingKey) {
        const title = localStorage.getItem('editingTitle') || '';
        const date = localStorage.getItem('editingDate') || '';
        const time = localStorage.getItem('editingTime') || '';
        const description = localStorage.getItem('editingDescription') || '';
        const alarm = localStorage.getItem('editingAlarm') === 'true'; // Leer el estado del checkbox.
        const repetition = localStorage.getItem('editingRepetition') || 'none'; // Obtener la repetición guardada.

        document.getElementById('titulo').value = title;
        document.getElementById('fecha').value = date;
        document.getElementById('tiempo').value = time;
        document.getElementById('descripcion').value = description;
        document.getElementById('alarma').checked = alarm;
        document.getElementById('repeticion').value = repetition;

        // Cambiar el texto del botón a "Actualizar".
        btnSubmit.textContent = 'Actualizar';

        // Mostrar el botón de "Cancelar".
        btnCancel.style.display = 'inline';
    }

    // Cancelar la edición.
    btnCancel.addEventListener('click', () => {
        // Limpiar localStorage y restablecer los campos.
        localStorage.removeItem('editingKey');
        localStorage.removeItem('editingTitle');
        localStorage.removeItem('editingDate');
        localStorage.removeItem('editingTime');
        localStorage.removeItem('editingDescription');
        localStorage.removeItem('editingAlarm');
        localStorage.removeItem('editingRepetition');

        // Restaurar los valores iniciales en el formulario.
        document.getElementById('titulo').value = '';
        document.getElementById('fecha').value = '';
        document.getElementById('tiempo').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('alarma').checked = false;
        document.getElementById('repeticion').value = 'none';

        // Volver a poner el texto del botón a "Añadir".
        btnSubmit.textContent = 'Añadir';

        // Ocultar el botón de "Cancelar".
        btnCancel.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener todos los datos del recordatorio.
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim() || 'Sin descripción';

        // Obtener el estado del checkbox de alarma.
        const alarm = document.getElementById('alarma').checked;

        // Obtener el valor de la repetición seleccionada.
        const repetition = document.getElementById('repeticion').value;

        // Obtener los días seleccionados si la repetición es "custom".
        let days = [];
        if (repetition === 'custom') {
            ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].forEach(day => {
                if (document.getElementById(day).checked) {
                    days.push(day);
                }
            });
        }

        // Comprobar que no están vacíos los campos obligatorios.
        if (!title || !date || !time) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        const reminderData = { 
            title, 
            date, 
            time, 
            description, 
            alarm, 
            repetition, 
            days // Guardar los días si son seleccionados.
        };

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
                    localStorage.removeItem('editingAlarm');
                    localStorage.removeItem('editingRepetition');

                    btnCancel.style.display = 'none'; // Ocultar botón de cancelar.
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
