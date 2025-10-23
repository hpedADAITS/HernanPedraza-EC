const tiempoElemento = document.getElementById("tiempo");
const btnIniciar = document.getElementById("iniciar");
const btnPausar = document.getElementById("pausar");
const btnReiniciar = document.getElementById("reiniciar");
let segundos = 0;
let intervalo = null;
function formatearTiempo(segundosTotales) {
	const minutos = Math.floor(segundosTotales / 60);
	const segundos = segundosTotales % 60;
	return `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}
function actualizarTiempo() {
	tiempoElemento.textContent = formatearTiempo(segundos);
}
btnIniciar.addEventListener("click", () => {
	if (intervalo) return;
	intervalo = setInterval(() => {
		segundos++;
		actualizarTiempo();
	}, 1000);
});
btnPausar.addEventListener("click", () => {
	clearInterval(intervalo);
	intervalo = null;
});
btnReiniciar.addEventListener("click", () => {
	clearInterval(intervalo);
	intervalo = null;
	segundos = 0;
	actualizarTiempo();
});
actualizarTiempo();
