// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, push, update } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const btnSubmit = form.querySelector('button[type="submit"]');
    const btnCancel = document.getElementById('cancelar-edicion');

    // Función para resetear los días personalizados.
    function resetDiasPersonalizados() {
        ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].forEach(day => {
            const checkbox = document.getElementById(day);
            if (checkbox) {
                checkbox.checked = false;
            }
        });
        const diasPersonalizados = document.getElementById('dias-personalizados');
        if (diasPersonalizados) {
            diasPersonalizados.style.display = 'none';
        }
    }

    // Rellenar campos si hay edición en curso.
    const editingKey = localStorage.getItem('editingKey');
    if (editingKey) {
        const title = localStorage.getItem('editingTitle') || '';
        const date = localStorage.getItem('editingDate') || '';
        const time = localStorage.getItem('editingTime') || '';
        const description = localStorage.getItem('editingDescription') || '';
        const group = localStorage.getItem('editingGroup') || '';
        const alarm = localStorage.getItem('editingAlarm') === 'true'; // Leer el estado del checkbox.
        const repetition = localStorage.getItem('editingRepetition') || 'none'; // Obtener la repetición guardada.
        const customDays = JSON.parse(localStorage.getItem('editingCustomDays') || '[]'); // Obtener los días personalizados.

        document.getElementById('titulo').value = title;
        document.getElementById('fecha').value = date;
        document.getElementById('tiempo').value = time;
        document.getElementById('descripcion').value = description;
        document.getElementById('grupo').value = group;
        document.getElementById('alarma').checked = alarm;
        document.getElementById('repeticion').value = repetition;

        // Forzar el evento de cambio manualmente.
        const event = new Event('change');
        document.getElementById('repeticion').dispatchEvent(event);

        // Si hay repetición personalizada, marca los días seleccionados.
        if (repetition === 'custom') {
            customDays.forEach(day => {
                const checkbox = document.getElementById(day);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }

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
        localStorage.removeItem('editingGroup');
        localStorage.removeItem('editingAlarm');
        localStorage.removeItem('editingRepetition');
        localStorage.removeItem('editingCustomDays');

        // Restaurar los valores iniciales en el formulario.
        form.reset();
        resetDiasPersonalizados();

        btnSubmit.textContent = 'Añadir';
        btnCancel.style.display = 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener todos los datos del recordatorio.
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim() || 'Sin descripción';
        const group = document.getElementById('grupo').value.trim() || 'Sin grupo';
        const alarm = document.getElementById('alarma').checked;
        const repetition = document.getElementById('repeticion').value;

        let days = [];
        if (repetition === 'custom') {
            ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].forEach(day => {
                const checkbox = document.getElementById(day);
                if (checkbox && checkbox.checked) {
                    days.push(day);
                }
            });
            // Guardar los días seleccionados en localStorage para su uso en la edición futura.
            localStorage.setItem('editingCustomDays', JSON.stringify(days));
            // Guardar los grupos.
            localStorage.setItem('editingGroup', group);
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
            group,
            alarm, 
            repetition, 
            days: repetition === 'custom' ? days : []
        };

        resetDiasPersonalizados();

        if (editingKey) {
            const reminderRef = ref(database, `recordatorios/${editingKey}`);
            update(reminderRef, reminderData)
                .then(() => {
                    alert('Recordatorio actualizado');
                    form.reset();
                    resetDiasPersonalizados();

                    btnSubmit.textContent = 'Añadir';

                    // Limpiar estado de edición.
                    localStorage.removeItem('editingKey');
                    localStorage.removeItem('editingTitle');
                    localStorage.removeItem('editingDate');
                    localStorage.removeItem('editingTime');
                    localStorage.removeItem('editingDescription');
                    localStorage.removeItem('editingGroup') || '';
                    localStorage.removeItem('editingAlarm');
                    localStorage.removeItem('editingRepetition');
                    localStorage.removeItem('editingCustomDays');

                    btnCancel.style.display = 'none';
                    location.reload();
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
                    resetDiasPersonalizados();

                    // Forzar evento change para ocultar bien los días personalizados.
                    const repeticionSelect = document.getElementById('repeticion');
                    repeticionSelect.dispatchEvent(new Event('change'));
                })
                .catch((error) => {
                    console.error('Error guardando:', error);
                });
        }
    });
});