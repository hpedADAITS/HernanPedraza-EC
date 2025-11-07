export const endpoints = {
  lmstudio: {
    name: "LM Studio",
    baseUrl: "/api/lmstudio",
    isLocal: true,
    model: "qwen3-4b-instruct-2507",
  },
};

export const getEndpointConfig = (endpointKey) => {
  return endpoints[endpointKey] || endpoints.lmstudio;
};
