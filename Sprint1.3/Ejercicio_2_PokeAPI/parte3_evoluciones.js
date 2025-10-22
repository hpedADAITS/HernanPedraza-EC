async function obtenerCadenaEvolutiva(pokemon) {
	try {
		const resSpecies = await fetch(
			`https://pokeapi.co/api/v2/pokemon-species/${pokemon.toLowerCase()}`
		);
		if (!resSpecies.ok) throw new Error("Pokémon no encontrado");
		const speciesData = await resSpecies.json();
		const resEvolution = await fetch(speciesData.evolution_chain.url);
		const evolutionData = await resEvolution.json();
		const evoluciones = [];
		const recorrer = node => {
			evoluciones.push(
				node.species.name.charAt(0).toUpperCase() +
					node.species.name.slice(1)
			);
			if (node.evolves_to.length > 0) recorrer(node.evolves_to[0]);
		};
		recorrer(evolutionData.chain);
		const detalles = await Promise.all(
			evoluciones.map(async name => {
				const res = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`
				);
				const data = await res.json();
				return {
					nombre: name,
					habilidades: data.abilities.map(a => a.ability.name)
				};
			})
		);
		console.log(detalles);
		return detalles;
	} catch (error) {
		console.error(error.message);
	}
}
