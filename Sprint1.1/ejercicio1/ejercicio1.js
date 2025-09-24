function cambiarColor() {
    // Generar valores aleatorios para los colores RGB
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    
    // Cambiar el color de fondo de la página con el nuevo valor RGB
    document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    document.body.style.h1 = `rgb(255, 255, 255)`;
}

