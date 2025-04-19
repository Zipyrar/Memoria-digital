// Importar el Firebase.
import { database } from '../firebaseConfig.js';
import { ref, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

/**
 * Elimina un recordatorio de la base de datos de Firebase.
 * @param {string} reminderKey - Clave del recordatorio a eliminar.
 */
export function deleteReminder(reminderKey) {
    // Comprobar si se recibió la clave.
    if (!reminderKey) {
        console.warn("No se proporcionó una clave para eliminar.");
        return;
    }

    const reminderRef = ref(database, `recordatorios/${reminderKey}`);
    remove(reminderRef)
        .then(() => {
            console.log(`Recordatorio con clave ${reminderKey} eliminado.`);
        })
        .catch((error) => {
            console.error("Error al eliminar el recordatorio:", error);
        });
}