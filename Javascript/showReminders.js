// Importar el firebase.
import { database } from '../firebaseConfig.js';
import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('listaRecordatorios');

    // Escuchar los recordatorios existentes y agregarlos a la lista
    const remindersRef = ref(database, 'recordatorios');
    onChildAdded(remindersRef, (data) => {
        const reminder = data.val();
        const key = data.key;

        // Crear el elemento para mostrar el recordatorio
        const item = document.createElement('li');
        item.innerHTML = `<strong>${reminder.title}</strong> - ${reminder.date} ${reminder.time}<br/><em>${reminder.description}</em>
            <button class="edit-btn" data-key="${key}">Editar</button>`;

        // Agregar el recordatorio a la lista
        list.appendChild(item);

        // Botón de edición
        item.querySelector('.edit-btn').addEventListener('click', () => {
            // Cargar los datos del recordatorio en el formulario para editar
            document.getElementById('titulo').value = reminder.title;
            document.getElementById('fecha').value = reminder.date;
            document.getElementById('tiempo').value = reminder.time;
            document.getElementById('descripcion').value = reminder.description;

            // Establecer la clave de edición para actualizar en lugar de crear
            currentEditingKey = key;
        });
    });
});