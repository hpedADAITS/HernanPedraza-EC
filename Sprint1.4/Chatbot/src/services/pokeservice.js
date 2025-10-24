export const fetchPokemon = async (query) => {
    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`
        );
        if (!response.ok) throw new Error('Pokémon not found!');
        const data = await response.json();
        const types = data.types.map((t) => t.type.name).join(', ');
        return {
            name: data.name.toUpperCase(),
            id: data.id,
            types,
            sprite: data.sprites.front_default,
        };
    } catch (error) {
        return { error: 'ERROR: Pokémon not found. Try another name or ID!' };
    }
};
