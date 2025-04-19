// Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recordatorio');
    const list = document.getElementById('listaRecordatorios');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar que se recargue la página.

        // Obtener los valores del formulario.
        const title = document.getElementById('titulo').value.trim();
        const date = document.getElementById('fecha').value;
        const time = document.getElementById('tiempo').value;
        const description = document.getElementById('descripcion').value.trim();

        // Comprobar si alguno de los elementos obligatorios están vacíos.
        if (!title || !date || !time) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Crear elemento para mostrar el recordatorio.
        const newItem = document.createElement('li');
        newItem.innerHTML = `
            <strong>${title}</strong> - ${date} ${time} <br/>
            <em>${description || 'Sin descripción'}</em>
        `;

        // Agregar a la lista.
        list.appendChild(newItem);

        // Reiniciar formulario.
        form.reset();
    });
});