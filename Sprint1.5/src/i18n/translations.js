export const translations = {
  en: {
    // Navigation
    conversations: "Conversations",
    pokedex: "Pokédex",
    settings: "Settings",

    // Auth
    login: "Login",
    logout: "Logout",
    loggedInAs: "Logged in as",

    // Settings
    settingsTitle: "Settings",
    account: "Account",
    appearance: "Appearance",
    darkMode: "Dark Mode",
    aiSettings: "AI Settings",
    temperature: "Temperature",
    temperatureDescription: "Controls randomness in responses (0.0 = deterministic, 2.0 = very creative)",

    // Chat
    newConversation: "New Conversation",
    sendMessage: "Send message...",
    thinking: "Thinking...",
    copy: "Copy",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    duplicate: "Duplicate",

    // Pokedex
    searchPokemon: "Search Pokemon by name, type, or ID... (Enter: find specific or load more)",
    loadingPokemon: "Loading Pokémon...",
    noPokemonFound: "No Pokémon found matching",

    // General
    cancel: "Cancel",
    close: "Close",
    save: "Save",
    tryAgain: "Try Again",
    loading: "Loading...",
    error: "Error",
    search: "Search",
    sortBy: "Sort by",
    newestFirst: "Newest First",
    oldestFirst: "Oldest First",
    alphabetical: "Alphabetical",

    // Search
    searchConversations: "Search conversations...",
    noConversationsFound: "No conversations found",
    noConversationsYet: "No conversations yet",
    tryDifferentSearch: "Try a different search term",
    createNewConversation: "Create a new conversation to get started",
    loadingConversations: "Loading conversations...",

    // Language
    language: "Language",
    selectLanguage: "Select Language",
  },
  es: {
    // Navigation
    conversations: "Conversaciones",
    pokedex: "Pokédex",
    settings: "Configuración",

    // Auth
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    loggedInAs: "Conectado como",

    // Settings
    settingsTitle: "Configuración",
    account: "Cuenta",
    appearance: "Apariencia",
    darkMode: "Modo Oscuro",
    aiSettings: "Configuración de IA",
    temperature: "Temperatura",
    temperatureDescription: "Controla la aleatoriedad en las respuestas (0.0 = determinista, 2.0 = muy creativo)",

    // Chat
    newConversation: "Nueva Conversación",
    sendMessage: "Enviar mensaje...",
    thinking: "Pensando...",
    copy: "Copiar",
    edit: "Editar",
    delete: "Eliminar",
    share: "Compartir",
    duplicate: "Duplicar",

    // Pokedex
    searchPokemon: "Buscar Pokemon por nombre, tipo o ID... (Enter: encontrar específico o cargar más)",
    loadingPokemon: "Cargando Pokémon...",
    noPokemonFound: "No se encontró ningún Pokémon que coincida",

    // General
    cancel: "Cancelar",
    close: "Cerrar",
    save: "Guardar",
    tryAgain: "Intentar de Nuevo",
    loading: "Cargando...",
    error: "Error",
    search: "Buscar",
    sortBy: "Ordenar por",
    newestFirst: "Más Reciente Primero",
    oldestFirst: "Más Antiguo Primero",
    alphabetical: "Alfabético",

    // Search
    searchConversations: "Buscar conversaciones...",
    noConversationsFound: "No se encontraron conversaciones",
    noConversationsYet: "Aún no hay conversaciones",
    tryDifferentSearch: "Prueba con un término de búsqueda diferente",
    createNewConversation: "Crea una nueva conversación para comenzar",
    loadingConversations: "Cargando conversaciones...",

    // Language
    language: "Idioma",
    selectLanguage: "Seleccionar Idioma",
  },
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key;
};
