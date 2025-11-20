/**
 * Conversation Manager
 * Manages all conversation-related API calls
 * Replaces localStorage with MariaDB backend
 */

import { apiClient } from './api.js';

export const conversationManager = {
  /**
   * Get all conversations for the current user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} Array of conversations
   */
  getAllConversations: async (userId) => {
    try {
      return await apiClient.get(`/conversations?userId=${userId}`);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      throw {
        message: 'Failed to load conversations. Please try again.',
        error,
      };
    }
  },

  /**
   * Get a specific conversation with its messages
   * @param {string} id - The conversation ID
   * @returns {Promise<Object>} Conversation object with messages
   */
  getConversation: async (id) => {
    try {
      return await apiClient.get(`/conversations/${id}`);
    } catch (error) {
      if (error.status === 404) {
        return null; // Conversation not found
      }
      console.error('Failed to fetch conversation:', error);
      throw {
        message: 'Failed to load conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Create a new conversation
   * @param {string} userId - The user ID
   * @param {string} title - Optional conversation title
   * @returns {Promise<Object>} New conversation object
   */
  createConversation: async (userId, title = null) => {
    try {
      return await apiClient.post('/conversations', {
        userId,
        title,
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw {
        message: 'Failed to create conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Update a conversation (title, etc.)
   * @param {string} id - The conversation ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated conversation
   */
  updateConversation: async (id, updates) => {
    try {
      return await apiClient.put(`/conversations/${id}`, updates);
    } catch (error) {
      console.error('Failed to update conversation:', error);
      throw {
        message: 'Failed to update conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Delete a conversation
   * @param {string} id - The conversation ID
   * @returns {Promise<void>}
   */
  deleteConversation: async (id) => {
    try {
      await apiClient.delete(`/conversations/${id}`);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw {
        message: 'Failed to delete conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Duplicate a conversation with all its messages
   * @param {string} id - The conversation ID to duplicate
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} Duplicated conversation
   */
  duplicateConversation: async (id, userId) => {
    try {
      return await apiClient.post(`/conversations/${id}/duplicate`, { userId });
    } catch (error) {
      console.error('Failed to duplicate conversation:', error);
      throw {
        message: 'Failed to duplicate conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Generate a share token for a conversation
   * @param {string} id - The conversation ID
   * @returns {Promise<string>} Share token
   */
  generateShareToken: async (id) => {
    try {
      const response = await apiClient.post(`/conversations/${id}/share`, {});
      return response.shareToken;
    } catch (error) {
      console.error('Failed to generate share token:', error);
      throw {
        message: 'Failed to generate share link. Please try again.',
        error,
      };
    }
  },

  /**
   * Get a conversation by share token (public access)
   * @param {string} token - The share token
   * @returns {Promise<Object>} Conversation object
   */
  getConversationByShareToken: async (token) => {
    try {
      return await apiClient.get(`/conversations/share/${token}`);
    } catch (error) {
      if (error.status === 404) {
        return null; // Token not found
      }
      console.error('Failed to fetch shared conversation:', error);
      throw {
        message: 'Failed to load shared conversation. Please try again.',
        error,
      };
    }
  },

  /**
   * Update messages for a conversation
   * @param {string} id - The conversation ID
   * @param {Array} messages - Array of messages
   * @returns {Promise<void>}
   */
  updateMessages: async (id, messages) => {
    try {
      // This is now handled by addMessage for individual messages
      // But keeping for backward compatibility if needed
      return await conversationManager.updateConversation(id, { messages });
    } catch (error) {
      console.error('Failed to update messages:', error);
      throw {
        message: 'Failed to update messages. Please try again.',
        error,
      };
    }
  },

  /**
   * Add a single message to a conversation
   * @param {string} conversationId - The conversation ID
   * @param {string} type - Message type (user or bot)
   * @param {string} text - Message text
   * @returns {Promise<Object>} Created message
   */
  addMessage: async (conversationId, type, text) => {
    try {
      return await apiClient.post('/messages', {
        conversationId,
        type,
        text,
      });
    } catch (error) {
      console.error('Failed to add message:', error);
      throw {
        message: 'Failed to send message. Please try again.',
        error,
      };
    }
  },

  /**
   * Get all messages for a conversation
   * @param {string} conversationId - The conversation ID
   * @returns {Promise<Array>} Array of messages
   */
  getMessages: async (conversationId) => {
    try {
      return await apiClient.get(`/messages/${conversationId}`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw {
        message: 'Failed to load messages. Please try again.',
        error,
      };
    }
  },

  /**
   * Delete a message
   * @param {string} messageId - The message ID
   * @returns {Promise<void>}
   */
  deleteMessage: async (messageId) => {
    try {
      await apiClient.delete(`/messages/${messageId}`);
    } catch (error) {
      console.error('Failed to delete message:', error);
      throw {
        message: 'Failed to delete message. Please try again.',
        error,
      };
    }
  },
};
