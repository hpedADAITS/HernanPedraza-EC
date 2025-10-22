function estudiantesAprobados(estudiantes) {
  return estudiantes
    .filter(e => Object.values(e.calificaciones).every(n => n >= 5))
    .map(e => e.nombre);
}
console.log(estudiantesAprobados(estudiantes));
