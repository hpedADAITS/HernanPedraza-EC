export const endpoints = {
  pokeapi: {
    name: "PokeAPI",
    baseUrl: "https://pokeapi.co/api/v2",
    isLocal: false,
  },
  lmstudio: {
    name: "LM Studio",
    baseUrl: "/api/lmstudio",
    isLocal: true,
    model: "qwen3-4b-instruct-2507",
  },
};

export const getEndpointConfig = (endpointKey) => {
  return endpoints[endpointKey] || endpoints.pokeapi; // Default to PokeAPI
};
