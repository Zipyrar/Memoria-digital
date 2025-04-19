// Importar el firebase.
import { database } from '../firebaseConfig.js';
import { ref, remove, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');

    // Obtener la clave del recordatorio en edición (almacenada en localStorage)
    const editingKey = localStorage.getItem('editingKey');  

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener los valores del formulario directamente
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim();

        // Validar que los campos obligatorios no estén vacíos
        if (!title || !date || !time) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        if (editingKey) {
            // Si estamos editando un recordatorio, eliminamos el recordatorio anterior
            const reminderRef = ref(database, 'recordatorios/' + editingKey);

            remove(reminderRef).then(() => {
                // Después de eliminarlo, actualizamos el mismo recordatorio con la misma clave
                const reminderToUpdateRef = ref(database, 'recordatorios/' + editingKey);  // Usamos la misma clave
                set(reminderToUpdateRef, {
                    title: title,
                    date: date,
                    time: time,
                    description: description || 'Sin descripción'
                }).then(() => {
                    alert('Recordatorio actualizado');
                    localStorage.removeItem('editingKey');  // Limpiar la clave de edición
                    form.reset();  // Reiniciar formulario
                    window.location.href = 'mostrar.html';  // Redirigir a la página de mostrar
                }).catch((error) => {
                    console.error("Error al guardar el recordatorio actualizado:", error);
                });
            }).catch((error) => {
                console.error("Error eliminando el recordatorio anterior:", error);
            });

        }
    });
});

