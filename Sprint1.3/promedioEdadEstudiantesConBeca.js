function promedioEdadEstudiantesConBeca(estudiantes) {
  const conBeca = estudiantes.filter(e => e.beca);
  const totalEdad = conBeca.reduce((acc, e) => acc + e.edad, 0);
  return totalEdad / conBeca.length;
}
console.log(promedioEdadEstudiantesConBeca(estudiantes));
