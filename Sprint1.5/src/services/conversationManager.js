const CONVERSATIONS_KEY = "botak_conversations";

export const conversationManager = {
  getAllConversations: () => {
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getConversation: (id) => {
    const conversations = conversationManager.getAllConversations();
    return conversations.find((conv) => conv.id === id);
  },

  createConversation: (title = null) => {
    const conversations = conversationManager.getAllConversations();
    const id = Date.now().toString();
    const conversation = {
      id,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      messages: [
        {
          type: "bot",
          text: "👋 Hi! I'm Botak. Ash me anything!",
        },
      ],
    };
    conversations.push(conversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    return conversation;
  },

  updateConversation: (id, updates) => {
    const conversations = conversationManager.getAllConversations();
    const index = conversations.findIndex((conv) => conv.id === id);
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates };
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
      return conversations[index];
    }
    return null;
  },

  deleteConversation: (id) => {
    let conversations = conversationManager.getAllConversations();
    conversations = conversations.filter((conv) => conv.id !== id);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  },

  duplicateConversation: (id) => {
    const conversations = conversationManager.getAllConversations();
    const original = conversations.find((conv) => conv.id === id);
    if (!original) return null;

    const newId = Date.now().toString();
    const duplicated = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
    };
    conversations.push(duplicated);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    return duplicated;
  },

  generateShareToken: (id) => {
    const conversations = conversationManager.getAllConversations();
    const conversation = conversations.find((conv) => conv.id === id);
    if (!conversation) return null;

    const shareToken = btoa(`${id}-${Date.now()}`);
    conversation.shareToken = shareToken;
    
    const index = conversations.findIndex((conv) => conv.id === id);
    conversations[index] = conversation;
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    
    return shareToken;
  },

  getConversationByShareToken: (token) => {
    const conversations = conversationManager.getAllConversations();
    return conversations.find((conv) => conv.shareToken === token);
  },

  updateMessages: (id, messages) => {
    return conversationManager.updateConversation(id, { messages });
  },
};
