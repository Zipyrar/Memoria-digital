document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const toggleBtn = document.getElementById("tema");

    // Detectar el tema guardado o usar claro por defecto.
    const savedTheme = localStorage.getItem("theme") || "light";

    // Función para aplicar tema y actualizar texto del botón.
    function applyTheme(theme) {
        if (theme === "dark") {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            toggleBtn.textContent = "Modo claro";
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            toggleBtn.textContent = "Modo oscuro";
        }
        localStorage.setItem("theme", theme);
    }

    applyTheme(savedTheme); // Aplicar el tema guardado al cargar.

    // Evento para alternar el tema.
    toggleBtn.addEventListener("click", () => {
        const currentTheme = body.classList.contains("dark-mode") ? "dark" : "light";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
    });
});
