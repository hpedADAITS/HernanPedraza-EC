async function compararPokemon(pokemon1, pokemon2) {
	try {
		const [res1, res2] = await Promise.all([
			fetch(
				`https://pokeapi.co/api/v2/pokemon/${pokemon1.toLowerCase()}`
			),
			fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon2.toLowerCase()}`)
		]);
		if (!res1.ok || !res2.ok)
			throw new Error("Alguno de los Pokémon no fue encontrado");
		const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
		const stats1 = data1.stats.map(s => ({
			name: s.stat.name,
			value: s.base_stat
		}));
		const stats2 = data2.stats.map(s => ({
			name: s.stat.name,
			value: s.base_stat
		}));
		const total1 = stats1.reduce((sum, s) => sum + s.value, 0);
		const total2 = stats2.reduce((sum, s) => sum + s.value, 0);
		console.table({
			[data1.name]: stats1.reduce(
				(acc, s) => ({ ...acc, [s.name]: s.value }),
				{}
			),
			[data2.name]: stats2.reduce(
				(acc, s) => ({ ...acc, [s.name]: s.value }),
				{}
			),
			Total: { [data1.name]: total1, [data2.name]: total2 }
		});
		console.log(
			`Mejor Pokémon: ${total1 > total2 ? data1.name : total2 > total1 ? data2.name : "Empate"}`
		);
	} catch (error) {
		console.error(error.message);
	}
}
