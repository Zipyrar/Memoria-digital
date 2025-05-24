// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

let sounded = new Set(); // Guardar recordatorios que ya sonaron.

// Función para comparar fecha y hora actual con los recordatorios.
function findOutAlarms() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const actualHour = now.toTimeString().slice(0, 5); // HH:MM
    const dayOfWeek = now.getDay(); // Día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado).

    const remindersRef = ref(database, 'recordatorios');

    onValue(remindersRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            const reminder = childSnapshot.val();

            // Verificar si la alarma está activada y la fecha y hora coinciden.
            const isTimeMatch = reminder.time === actualHour;
            const isAlarmActive = reminder.alarm;

            // Comprobar si el recordatorio tiene repetición y si corresponde a hoy.
            const isRepetitionMatch = checkRepetition(reminder, dayOfWeek);

            if (
                isTimeMatch &&
                isAlarmActive &&
                isRepetitionMatch &&
                !sounded.has(key) // Verificar si ya sonó.
            ) {
                // Mostrar alarma y agregarla a la lista de sonadas.
                showAlarm(reminder);
                sounded.add(key);
            }
        });
    });
}

// Función para verificar la repetición de un recordatorio.
function checkRepetition(reminder, dayOfWeek) {
    const today = new Date().toISOString().split('T')[0];

    switch (reminder.repetition) {
        case 'none':
            return reminder.date === today; // Solo sonar si hoy es la fecha exacta
        case 'daily':
            return true;
        case 'weekly':
            return reminder.days && reminder.days.includes(getDayName(dayOfWeek));
        case 'monthly':
            return isSameDayOfMonth(reminder.date);
        case 'yearly':
            return isSameDateOfYear(reminder.date);
        case 'custom':
            return reminder.days && reminder.days.includes(getDayName(dayOfWeek));
        default:
            return false;
    }
}


// Función para obtener el nombre del día a partir del índice (0 = Domingo, 1 = Lunes, ..., 6 = Sábado).
function getDayName(dayOfWeek) {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[dayOfWeek];
}

// Función para verificar si la fecha es el mismo día del mes (repetición mensual).
function isSameDayOfMonth(reminderDate) {
    const now = new Date();
    const reminderDateObj = new Date(reminderDate);
    return now.getDate() === reminderDateObj.getDate(); // Comparar solo el día del mes.
}

// Función para verificar si es el mismo día y mes (repetición anual).
function isSameDateOfYear(reminderDate) {
    const now = new Date();
    const reminderDateObj = new Date(reminderDate);
    return now.getMonth() === reminderDateObj.getMonth() && now.getDate() === reminderDateObj.getDate(); // Comparar mes y día.
}

function showAlarm(reminder) {
    const sound = new Audio('alarms/attention_tone.mp3');
    sound.play();

    const container = document.getElementById("alarm-toast-container");

    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-warning border-0 show";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const message = `Recordatorio: ${reminder.title}`;
    const hour = `Hora: ${reminder.time}`;
    const description = reminder.description || '';

    // Crear contenido del toast.
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${message}</strong><br/>
                ${hour}<br/>
                ${description}
            </div>
        </div>
    `;

    // Notificación del navegador.
    if (Notification.permission === "granted") {
        new Notification(message, {
            body: `${hour}\n${description}`,
            icon: 'images/post-it.png' // Imagen de icono.
        });
    } else {
        alert(`${message}\n${hour}\n${description}`);
    }

    container.appendChild(toast);

    // Quitar el toast automáticamente después de 15 segundos.
    setTimeout(() => {
        toast.remove();
    }, 15000);
}

// Repetir cada 10 segundos para asegurar exactitud.
setInterval(findOutAlarms, 10000);