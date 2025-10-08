const form = document.getElementById('formEncuesta');
const grafico = document.getElementById('grafico');

const votos = {
  'Rojo': 0,
  'Azul': 0,
  'Verde': 0,
  'Amarillo': 0
};

function actualizarGrafico() {
  const coloresVisuales = {
    'Rojo': 'red',
    'Azul': 'blue',
    'Verde': 'green',
    'Amarillo': 'gold'
  };

  function actualizarGrafico() {
    grafico.innerHTML = ''; 

    const maxVotos = Math.max(...Object.values(votos)) || 1;

    for (let color in votos) {
      const cantidad = votos[color];
      const altura = (cantidad / maxVotos) * 100;

      const columna = document.createElement('div');
      columna.classList.add('columna');

      const barra = document.createElement('div');
      barra.classList.add('barra');
      barra.style.height = `${altura * 2}px`; 
      barra.style.backgroundColor = coloresVisuales[color]; 
      barra.textContent = cantidad;

      const etiqueta = document.createElement('div');
      etiqueta.classList.add('etiqueta');
      etiqueta.textContent = color;

      columna.appendChild(barra);
      columna.appendChild(etiqueta);
      grafico.appendChild(columna);
    }
  }
}


form.addEventListener('submit', function(event) {
  event.preventDefault();

  const seleccion = form.color.value;

  if (!seleccion) {
    alert("Por favor, selecciona una opción.");
    return;
  }

  votos[seleccion]++;
  actualizarGrafico();
  form.reset();
});


actualizarGrafico();
