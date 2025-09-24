function calcularArea() {
    // Obtener valores de los inputs
    const ancho = parseFloat(document.getElementById("ancho").value);
    const alto = parseFloat(document.getElementById("alto").value);

    // Verificar que los valores sean válidos
    if (isNaN(ancho) || isNaN(alto)) {
        document.getElementById("resultado").textContent = "Por favor, introduce valores numéricos válidos.";
        return;
    }

    // Calcular el área
    const area = ancho * alto;

    // Mostrar el resultado
    document.getElementById("resultado").textContent = `El área del rectángulo es: ${area}`;
}
