// Importar el firebase.
import { database } from '../firebaseConfig.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const lista = document.getElementById('listaRecordatorios');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar que se recargue la página.

        // Obtener los valores del formulario.
        const titulo = document.getElementById('titulo').value.trim();
        const fecha = document.getElementById('fecha').value;
        const tiempo = document.getElementById('tiempo').value;
        const descripcion = document.getElementById('descripcion').value.trim();

        // Comprobar si alguno de los elementos obligatorios están vacíos.
        if (!titulo || !fecha || !tiempo) {
            alert('Completa todos los campos obligatorios.');
            return;
        }

        // Crear el nuevo recordatorio.
        const nuevo = {
            titulo,
            fecha,
            tiempo,
            descripcion: descripcion || 'Sin descripción'
        };

        // Guardarlo en Firebase.
        const recordatoriosRef = ref(database, 'recordatorios');
        push(recordatoriosRef, nuevo);

        // Reiniciar formulario.
        form.reset();
    });

    const recordatoriosRef = ref(database, 'recordatorios');
    onChildAdded(recordatoriosRef, (data) => {
        const recordatorio = data.val();
        // Crear elemento para mostrar el recordatorio.
        const item = document.createElement('li');
        item.innerHTML = `<strong>${recordatorio.titulo}</strong> - ${recordatorio.fecha} ${recordatorio.tiempo}<br/><em>${recordatorio.descripcion}</em>`;
        lista.appendChild(item);
    });
});