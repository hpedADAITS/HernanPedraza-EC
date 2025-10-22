function calcularArea() {
    const ancho = parseFloat(document.getElementById("ancho").value);
    const alto = parseFloat(document.getElementById("alto").value);
    if (isNaN(ancho) || isNaN(alto)) {
        document.getElementById("resultado").textContent = "Por favor, introduce valores numéricos válidos.";
        return;
    }
    const area = ancho * alto;
    document.getElementById("resultado").textContent = `El área del rectángulo es: ${area}`;
}
