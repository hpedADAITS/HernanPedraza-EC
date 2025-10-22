function mejoresEstudiantes(estudiantes) {
  const promedios = estudiantes.map(e => {
    const notas = Object.values(e.calificaciones);
    const prom = notas.reduce((a, b) => a + b, 0) / notas.length;
    return { ...e, promedio: prom };
  });
  return promedios.sort((a, b) => b.promedio - a.promedio).slice(0, 2);
}
console.log(mejoresEstudiantes(estudiantes));
