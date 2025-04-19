// Importar lo de Firebase.
import { database } from '../firebaseConfig.js';
import { ref, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('listaRecordatorios');

    // Agregar los recordatorios existentes a la lista.
    const remindersRef = ref(database, 'recordatorios');
    onChildAdded(remindersRef, (data) => {
        const reminder = data.val();
        const key = data.key;

        // Crear el elemento de lista para mostrar el recordatorio.
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${reminder.title}</strong> - ${reminder.date} ${reminder.time}<br/>
            <em>${reminder.description}</em><br/>
            <button class="edit-btn" data-key="${key}">Editar</button>
            <button class="delete-btn" data-key="${key}">Eliminar</button>
        `;

        // Agregar el recordatorio a la lista.
        list.appendChild(item);

        // Botón de edición.
        item.querySelector('.edit-btn').addEventListener('click', () => {
            document.getElementById('titulo').value = reminder.title;
            document.getElementById('fecha').value = reminder.date;
            document.getElementById('tiempo').value = reminder.time;
            document.getElementById('descripcion').value = reminder.description;
        
            // Guardar la clave en localStorage.
            localStorage.setItem('editingKey', key);
        });

        // Botón para eliminar.
        item.querySelector('.delete-btn').addEventListener('click', () => {
            const confirmDelete = confirm('¿Estás seguro de que quieres eliminar este recordatorio?');
            if (confirmDelete) {
                const reminderRef = ref(database, `recordatorios/${key}`);
                remove(reminderRef)
                    .then(() => {
                        alert('Recordatorio eliminado');
                        item.remove(); // Quitar de la lista en el DOM.
                    })
                    .catch((error) => {
                        console.error('Error al eliminar el recordatorio:', error);
                    });
            }
        });
    });
});