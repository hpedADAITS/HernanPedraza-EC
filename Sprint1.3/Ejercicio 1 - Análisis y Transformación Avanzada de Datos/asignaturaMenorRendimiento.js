function asignaturaMenorRendimiento(estudiantes) {
	const materias = Object.keys(estudiantes[0].calificaciones);
	let menorProm = Infinity;
	let peorMateria = "";
	for (const materia of materias) {
		const promedio =
			estudiantes.reduce(
				(acc, est) => acc + est.calificaciones[materia],
				0
			) / estudiantes.length;
		if (promedio < menorProm) {
			menorProm = promedio;
			peorMateria = materia;
		}
	}
	return peorMateria;
}
console.log(asignaturaMenorRendimiento(estudiantes));
