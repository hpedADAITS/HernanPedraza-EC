export const fetchPokemon = async (query) => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`
    );
    if (!response.ok) throw new Error("Pokémon not found!");
    const data = await response.json();
    return {
      type: "pokemon",
      name: data.name.toUpperCase(),
      id: data.id,
      types: data.types.map((t) => t.type.name).join(", "),
      sprite: data.sprites.front_default,
    };
  } catch (error) {
    return {
      type: "bot",
      text: "❌ Pokémon not found. Try another name or ID!",
    };
  }
};
