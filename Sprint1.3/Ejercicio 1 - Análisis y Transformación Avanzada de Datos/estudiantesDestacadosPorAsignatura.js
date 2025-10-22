function estudiantesDestacadosPorAsignatura(estudiantes, asignatura) {
	return estudiantes
		.sort(
			(a, b) =>
				b.calificaciones[asignatura] - a.calificaciones[asignatura]
		)
		.slice(0, 3);
}
console.log(estudiantesDestacadosPorAsignatura(estudiantes, "matematicas"));
