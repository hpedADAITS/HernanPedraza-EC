function filtrarPorCiudadYAsignatura(estudiantes, ciudad, asignatura) {
	return estudiantes
		.filter(e => e.ciudad === ciudad)
		.sort(
			(a, b) =>
				b.calificaciones[asignatura] - a.calificaciones[asignatura]
		);
}
console.log(filtrarPorCiudadYAsignatura(estudiantes, "Madrid", "fisica"));
