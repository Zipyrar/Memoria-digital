// Importar el firebase.
import { database } from '../firebaseConfig.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const list = document.getElementById('listaRecordatorios');

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

        // Crear el nuevo recordatorio.
        const newReminder = {
            title,
            date,
            time,
            description: description || 'Sin descripción'
        };

        // Guardarlo en Firebase.
        const remindersRef = ref(database, 'recordatorios');
        push(remindersRef, newReminder);

        // Reiniciar formulario.
        form.reset();
    });

    const remindersRef = ref(database, 'recordatorios');
    onChildAdded(remindersRef, (data) => {
        const reminder = data.val();
        // Crear elemento para mostrar el recordatorio.
        const item = document.createElement('li');
        item.innerHTML = `<strong>${reminder.title}</strong> - ${reminder.date} ${reminder.time}<br/><em>${reminder.description}</em>`;
        list.appendChild(item);
    });
});