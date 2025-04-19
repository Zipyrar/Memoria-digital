import { database } from '../firebaseConfig.js';
import {
    ref,
    push,
    set,
    get,
    onValue,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Función para editar recordatorio.
function editReminder(id, reminder) {
    document.getElementById('titulo').value = reminder.title;
    document.getElementById('fecha').value = reminder.date;
    document.getElementById('tiempo').value = reminder.time;
    document.getElementById('descripcion').value = reminder.description;

    const formButton = document.getElementById('form-recordatorio').querySelector('button[type="submit"]');
    formButton.innerText = 'Guardar cambios';
    formButton.dataset.id = id;
}

// Evento para guardar el formulario.
const form = document.getElementById('form-recordatorio');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('titulo').value.trim();
    const date = document.getElementById('fecha').value;
    const time = document.getElementById('tiempo').value;
    const description = document.getElementById('descripcion').value.trim();

    if (!title || !date || !time) {
        alert('Completa todos los campos obligatorios.');
        return;
    }

    const formButton = form.querySelector('button[type="submit"]');
    const id = formButton.dataset.id;

    const updated = {
        title,
        date,
        time,
        description: description || 'Sin descripción'
    };

    if (id) {
        const reminderRef = ref(database, 'recordatorios/' + id);
        await set(reminderRef, updated);
    } else {
        const newReminderRef = push(ref(database, 'recordatorios'));
        await set(newReminderRef, updated);
    }

    form.reset();
    formButton.innerText = 'Añadir';
    delete formButton.dataset.id;
});

// Mostrar recordatorios con botones de edición.
function showReminders(reminders) {
    const list = document.getElementById('listaRecordatorios');
    list.innerHTML = '';

    for (const id in reminders) {
        const reminder = reminders[id];
        const item = document.createElement('li');
        item.innerHTML = `
            <strong>${reminder.title}</strong> - ${reminder.date} ${reminder.time}<br/>
            <em>${reminder.description}</em>
            <button class="edit-btn" data-id="${id}">Editar</button>
        `;

        item.querySelector('.edit-btn').addEventListener('click', () => {
            editReminder(id, reminder);
        });

        list.appendChild(item);
    }
}

// Cargar recordatorios desde Firebase (sin duplicar).
function chargeReminders() {
    const remindersRef = ref(database, 'recordatorios');

    // Escucha los cambios y actualiza la interfaz.
    onValue(remindersRef, (snapshot) => {
        if (snapshot.exists()) {
            const reminders = snapshot.val();
            showReminders(reminders);
        } else {
            showReminders({});
        }
    });
}

chargeReminders();