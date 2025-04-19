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

    // Mostrar una confirmación al usuario.
    const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este recordatorio?");
    
    if (confirmDelete) {
        const reminderRef = ref(database, `recordatorios/${reminderKey}`);
        
        // Intentar eliminar el recordatorio.
        remove(reminderRef)
            .then(() => {
                alert("Recordatorio eliminado con éxito.");
                console.log(`Recordatorio con clave ${reminderKey} eliminado.`);
            })
            .catch((error) => {
                console.error("Error al eliminar el recordatorio:", error);
                alert("Hubo un error al eliminar el recordatorio.");
            });
    } else {
        alert("Eliminación cancelada por el usuario.");
    }
}