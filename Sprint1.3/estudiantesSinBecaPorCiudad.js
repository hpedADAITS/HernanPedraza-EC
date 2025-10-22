function estudiantesSinBecaPorCiudad(estudiantes, ciudad) {
  return estudiantes.filter(e => e.ciudad === ciudad && !e.beca).length;
}
console.log(estudiantesSinBecaPorCiudad(estudiantes, 'Madrid'));
