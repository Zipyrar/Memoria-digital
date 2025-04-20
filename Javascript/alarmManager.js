// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

let sounded = new Set(); // Guardar recordatorios que ya sonaron.

// Función para comparar fecha y hora actual con los recordatorios.
function findOutAlarms() {
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const actualHour = now.toTimeString().slice(0, 5); // HH:MM

    const remindersRef = ref(database, 'recordatorios');

    onValue(remindersRef, (snapshot) => {
        snapshot.forEach(childSnapshot => {
            const key = childSnapshot.key;
            const reminder = childSnapshot.val();

            if (
                reminder.date === today &&
                reminder.time === actualHour &&
                !sounded.has(key) &&
                reminder.alarm // Verificar si la alarma está activada.
            ) {
                // Mostrar alerta y sonar alarma.
                showAlarm(reminder);
                sounded.add(key); // Para que no suene otra vez.
            }
        });
    });
}

function showAlarm(reminder) {
    const sonido = new Audio('alarms/attention_tone.mp3');
    sonido.play();

    const container = document.getElementById("alarm-toast-container");

    const toast = document.createElement("div");
    toast.className = "toast align-items-center text-bg-warning border-0 show";
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");

    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>Alarma:</strong> ${reminder.title}<br>
                <strong>${reminder.time}</strong><br>
                ${reminder.description}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
    `;

    container.appendChild(toast);

    // Quitar el toast automáticamente después de 10 segundos.
    setTimeout(() => {
        toast.remove();
    }, 10000);
}

// Repetir cada 10 segundos para asegurar exactitud.
setInterval(findOutAlarms, 10000);