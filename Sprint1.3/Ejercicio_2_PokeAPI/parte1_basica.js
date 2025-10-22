async function obtenerInfoBasicaPokemon(nombrePokemon) {
	try {
		const res = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`
		);
		if (!res.ok) throw new Error("Pokémon no encontrado");
		const data = await res.json();
		const info = {
			nombre: data.name.charAt(0).toUpperCase() + data.name.slice(1),
			id: data.id,
			tipos: data.types.map(
				t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)
			),
			imagen: data.sprites.front_default
		};
		console.log(info);
		return info;
	} catch (error) {
		console.error(error.message);
	}
}
