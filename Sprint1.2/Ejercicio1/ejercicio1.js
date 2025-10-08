const inputSegundos = document.getElementById('inputSegundos');
const btnIniciar = document.getElementById('btnIniciar');
const tiempoRestante = document.getElementById('tiempoRestante');

let intervalo; // Para guardar el setInterval y luego poder detenerlo

btnIniciar.addEventListener('click', () => {
  // Limpiar cualquier temporizador previo
  clearInterval(intervalo);

  let segundos = parseInt(inputSegundos.value);

  if (isNaN(segundos) || segundos <= 0) {
    tiempoRestante.textContent = "Por favor, ingresa un número válido de segundos.";
    return;
  }

  // Mostrar el tiempo inicial
  tiempoRestante.textContent = `Tiempo restante: ${segundos} segundos`;

  // Iniciar el temporizador
  intervalo = setInterval(() => {
    segundos--;
    if (segundos > 0) {
      tiempoRestante.textContent = `Tiempo restante: ${segundos} segundos`;
    } else {
      clearInterval(intervalo);
      tiempoRestante.textContent = "¡Tiempo finalizado!";
    }
  }, 1000);
});
