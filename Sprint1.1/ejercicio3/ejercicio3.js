function agregarElemento() {
    const input = document.getElementById("entrada");
    const texto = input.value.trim(); // Eliminar espacios en blanco
    if (texto !== "") {
        const nuevoItem = document.createElement("li");
        nuevoItem.textContent = texto;
        document.getElementById("lista").appendChild(nuevoItem);
        input.value = "";
        input.focus();
    } else {
        alert("Por favor, escribe un texto antes de añadir a la lista.");
    }
}
