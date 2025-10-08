const num1 = document.getElementById('numero1');
const num2 = document.getElementById('numero2');
const operacion = document.getElementById('operacion');
const botonCalcular = document.getElementById('calcular');
const resultado = document.getElementById('resultado');

botonCalcular.addEventListener('click', () => {
  const valor1 = parseFloat(num1.value);
  const valor2 = parseFloat(num2.value);
  const op = operacion.value;

  if (isNaN(valor1) || isNaN(valor2)) {
    resultado.textContent = "Por favor, ingresa ambos números.";
    return;
  }

  let res;

  switch (op) {
    case "+":
      res = valor1 + valor2;
      break;
    case "-":
      res = valor1 - valor2;
      break;
    case "*":
      res = valor1 * valor2;
      break;
    case "/":
      if (valor2 === 0) {
        resultado.textContent = "Error: división por cero.";
        return;
      }
      res = valor1 / valor2;
      break;
    default:
      resultado.textContent = "Operación no válida.";
      return;
  }

  resultado.textContent = `Resultado: ${res}`;
});
