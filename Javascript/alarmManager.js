// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

let sounded = new Set(); // Guardar recordatorios que ya sonaron.
let lastCheckedDay = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// Verificar si la hora coincide exactamente.
function isTimeExact(reminderTime, currentTime) {
    return reminderTime === currentTime;
}

// Función principal: buscar alarmas que deben sonar.
function findOutAlarms() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const actualHour = now.toTimeString().slice(0, 5); // HH:MM
    const dayOfWeek = now.getDay(); // 0 = domingo, ..., 6 = sábado.

    // Limpiar si cambió el día.
    if (today !== lastCheckedDay) {
        sounded.clear();
        lastCheckedDay = today;
    }

    const remindersRef = ref(database, 'recordatorios');

    onValue(remindersRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            const reminder = childSnapshot.val();

            const isTimeMatch = isTimeExact(reminder.time, actualHour);
            const isAlarmActive = reminder.alarm;
            const isRepetitionMatch = checkRepetition(reminder, dayOfWeek);

            // Hacer que la alarma correspondiente suene.
            if (
                isTimeMatch &&
                isAlarmActive &&
                isRepetitionMatch &&
                !sounded.has(key)
            ) {
                showAlarm(reminder);
                sounded.add(key);
            }
        });
    });
}

// Comprobar repetición del recordatorio.
function checkRepetition(reminder, dayOfWeek) {
    const today = new Date().toISOString().split('T')[0];
    const todayName = getDayName(dayOfWeek).toLowerCase();

    switch (reminder.repetition) {
        case 'none':
            return reminder.date === today;
        case 'daily':
            return true;
        case 'weekly':
            if (Array.isArray(reminder.days) && reminder.days.length > 0) {
                return reminder.days.map(d => d.toLowerCase()).includes(todayName);
            }
            return getDayName(new Date(reminder.date).getDay()).toLowerCase() === todayName;
        case 'monthly':
            return isSameDayOfMonth(reminder.date);
        case 'yearly':
            return isSameDateOfYear(reminder.date);
        case 'custom':
            if (Array.isArray(reminder.days) && reminder.days.length > 0) {
                const daysNormalized = reminder.days.map(day => day.toLowerCase());
                // Permitir que suene el día exacto de la fecha asignada.
                return daysNormalized.includes(todayName) || reminder.date === today;
            }
            // Si no hay días personalizados, sonar solo el día asignado.
            return reminder.date === today;
        default:
            return false;
    }
}

// Devuelve nombre del día (0 = domingo).
function getDayName(dayOfWeek) {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return days[dayOfWeek];
}

// Comparar solo el día del mes (repetición mensual).
function isSameDayOfMonth(reminderDate) {
    const now = new Date();
    const reminderDateObj = new Date(reminderDate);
    return now.getDate() === reminderDateObj.getDate();
}

// Comparar mes y día (repetición anual).
function isSameDateOfYear(reminderDate) {
    const now = new Date();
    const reminderDateObj = new Date(reminderDate);
    return now.getMonth() === reminderDateObj.getMonth() &&
           now.getDate() === reminderDateObj.getDate();
}

// Mostrar alarma.
function showAlarm(reminder) {
    const sound = new Audio('alarms/attention_tone.mp3');
    sound.play().catch(e => console.warn("Error al reproducir audio:", e));

    const container = document.getElementById("alarm-toast-container");
    if (!container) {
        console.warn("No se encontró el contenedor de toasts");
        return;
    }

    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-warning border-0 show";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    const message = `Recordatorio: ${reminder.title}`;
    const group = `Grupo: ${reminder.group}`;
    const hour = `Hora: ${reminder.time}`;
    const description = reminder.description || '';

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${message}</strong><br/>
                <strong>${group}</strong><br/>
                ${hour}<br/>
                ${description}
            </div>
        </div>
    `;

    container.appendChild(toast);

    // Eliminar a los 15 segundos.
    setTimeout(() => {
        toast.remove();
    }, 15000);
}

// Comprobar cada 10 segundos.
setInterval(findOutAlarms, 10000);
