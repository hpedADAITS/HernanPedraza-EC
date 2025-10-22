function mejoraNotasBeca(estudiantes) {
  return estudiantes.map(est => {
    if (est.beca) {
      const nuevas = {};
      for (const [materia, nota] of Object.entries(est.calificaciones)) {
        nuevas[materia] = Math.min(10, nota * 1.1);
      }
      return { ...est, calificaciones: nuevas };
    }
    return est;
  });
}
console.log(mejoraNotasBeca(estudiantes));
