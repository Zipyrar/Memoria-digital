import { database } from '../firebaseConfig.js';
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('listaRecordatorios');
    const groupFilter = document.getElementById('filtroGrupo');
    const remindersRef = ref(database, 'recordatorios');

    let allReminders = {}; // Guardar todos los recordatorios localmente.
    let groupsSet = new Set(); // Detectar grupos únicos.

    // Función para actualizar la lista según filtro.
    function actualizarLista() {
        list.innerHTML = '';

        const filter = groupFilter.value;

        if (filter === 'all') {
            // Mostrar todos sin agrupar.
            Object.entries(allReminders).forEach(([key, reminder]) => {
                const item = crearItemRecordatorio(reminder, key);
                list.appendChild(item);
            });

        } else if (filter === 'grouped') {
            // Agrupar recordatorios por grupo.
            const groups = {};

            // Agrupar.
            Object.entries(allReminders).forEach(([key, reminder]) => {
                const group = reminder.group || 'Sin grupo';
                if (!groups[group]) groups[group] = [];
                groups[group].push({ key, reminder });
            });

            // Mostrar agrupados.
            for (const group in groups) {
                const header = document.createElement('h3');
                header.textContent = group;
                list.appendChild(header);

                const ulGroup = document.createElement('ul');
                ulGroup.classList.add('list-group', 'mb-4');

                groups[group].forEach(({ key, reminder }) => {
                    const item = crearItemRecordatorio(reminder, key);
                    ulGroup.appendChild(item);
                });

                list.appendChild(ulGroup);
            }

        } else {
            // Mostrar solo recordatorios del grupo seleccionado.
            Object.entries(allReminders).forEach(([key, reminder]) => {
                if ((reminder.group || '') === filter) {
                    const item = crearItemRecordatorio(reminder, key);
                    list.appendChild(item);
                }
            });
        }

        asignarEventosBotones();
    }

    // Crear lista con los datos del recordatorio.
    function crearItemRecordatorio(reminder, key) {
        const item = document.createElement('li');
        item.classList.add('mb-3', 'list-group-item');

        item.innerHTML = `
            <strong>${reminder.title}</strong><br/>
            Fecha: ${reminder.date}<br/>
            Hora: ${reminder.time}<br/>
            ${reminder.description ? `Descripción: ${reminder.description}<br/>` : ''}
            Grupo: ${reminder.group || 'Sin grupo'}<br/>
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

        return item;
    }

    // Asignar eventos a botones Editar y Eliminar.
    function asignarEventosBotones() {
        document.querySelectorAll('.editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const reminder = allReminders[id];

                localStorage.setItem('editingKey', id);
                localStorage.setItem('editingTitle', reminder.title);
                localStorage.setItem('editingDate', reminder.date);
                localStorage.setItem('editingTime', reminder.time);
                localStorage.setItem('editingDescription', reminder.description || '');
                localStorage.setItem('editingRepetition', reminder.repetition || 'none');
                if (reminder.repetition === 'custom') {
                    localStorage.setItem('editingCustomDays', JSON.stringify(reminder.days || []));
                }
                localStorage.setItem('editingGroup', reminder.group || '');

                location.reload();
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
    }

    // Listener para cambiar filtro.
    groupFilter.addEventListener('change', actualizarLista);

    // Cargar datos de Firebase.
    onValue(remindersRef, (snapshot) => {
        allReminders = {};
        groupsSet.clear();

        snapshot.forEach(childSnapshot => {
            const reminder = childSnapshot.val();
            const key = childSnapshot.key;
            allReminders[key] = reminder;
            if (reminder.group) {
                groupsSet.add(reminder.group);
            }
        });

        // Actualizar opciones de grupos en el select.
        // Primero limpiar opciones excepto las dos primeras.
        while (groupFilter.options.length > 2) {
            groupFilter.remove(2);
        }
        groupsSet.forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            filtroGrupo.appendChild(option);
        });

        // Actualizar la lista según filtro actual.
        actualizarLista();
    });
});
