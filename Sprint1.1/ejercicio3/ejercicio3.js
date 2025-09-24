function agregarElemento() {
    const input = document.getElementById("entrada");
    const texto = input.value.trim(); // Eliminar espacios en blanco

    if (texto !== "") {
        // Crear un nuevo elemento <li>
        const nuevoItem = document.createElement("li");
        nuevoItem.textContent = texto;

        // Agregar el nuevo elemento a la lista
        document.getElementById("lista").appendChild(nuevoItem);

        // Limpiar el campo de entrada
        input.value = "";
        input.focus();
    } else {
        alert("Por favor, escribe un texto antes de añadir a la lista.");
    }
}
