document.addEventListener("DOMContentLoaded", () => {
    const cajas = document.querySelectorAll(".caja");

    cajas.forEach(caja => {
        // Al pasar el mouse por encima
        caja.addEventListener("mouseover", () => {
            caja.style.backgroundColor = "blue";
            caja.style.color = "white";
        });

        // Al quitar el mouse
        caja.addEventListener("mouseout", () => {
            caja.style.backgroundColor = "#f0f0f0";
            caja.style.color = "#000";
        });
    });
});
