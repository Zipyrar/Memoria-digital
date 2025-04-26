// Importar Firebase.
import { database } from '../firebaseConfig.js';
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const lista = document.getElementById('listaRecordatorios');
    const remindersRef = ref(database, 'recordatorios');

    onValue(remindersRef, (snapshot) => {
        lista.innerHTML = ''; // Limpiar lista
    
        snapshot.forEach(childSnapshot => {
            const reminder = childSnapshot.val();
            const key = childSnapshot.key;
    
            const item = document.createElement('li');
            item.classList.add('mb-3', 'list-group-item');
    
            // Mostrar todos los datos, incluyendo la repetición.
            item.innerHTML = `
                <strong>${reminder.title}</strong><br/>
                Fecha: ${reminder.date}<br/>
                Hora: ${reminder.time}<br/>
                ${reminder.description ? `Descripción: ${reminder.description}<br/>` : ''}
                 Repetición: ${
                    reminder.repetition === 'none'
                        ? 'Ninguna'
                        : reminder.repetition === 'daily'
                            ? 'Diariamente'
                            : reminder.repetition === 'weekly'
                                ? 'Semanalmente'
                                : reminder.repetition === 'custom'
                                    ? `Personalizada (${(reminder.days || []).join(', ')})`
                                    : reminder.repetition
                }<br/>
                Alarma: ${reminder.alarm ? 'Activada' : 'Desactivada'}<br/>
                <button class="btn btn-sm btn-warning me-2 editar" data-id="${key}">Editar</button>
                <button class="btn btn-sm btn-danger eliminar" data-id="${key}">Eliminar</button>
            `;

    
            lista.appendChild(item);
        });
    
        // Asignar eventos después de insertar los elementos.
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const recordatorio = snapshot.child(id).val();
    
                // Guardar datos en localStorage.
                localStorage.setItem('editingKey', id);
                localStorage.setItem('editingTitle', recordatorio.title);
                localStorage.setItem('editingDate', recordatorio.date);
                localStorage.setItem('editingTime', recordatorio.time);
                localStorage.setItem('editingDescription', recordatorio.description || '');
                localStorage.setItem('editingRepetition', recordatorio.repetition || 'none');
                if (recordatorio.repetition === 'custom') {
                    localStorage.setItem('editingCustomDays', JSON.stringify(recordatorio.days || []));
                }
    
                location.reload(); // Recargar para editar el recordatorio.
            });
        });
    
        document.querySelectorAll('.eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const confirmDelete = confirm('¿Estás seguro de eliminar este recordatorio?');
                if (confirmDelete) {
                    remove(ref(database, `recordatorios/${id}`));
                }
            });
        });
    });    
});