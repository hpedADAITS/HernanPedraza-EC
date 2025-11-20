import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

const router = express.Router();

/**
 * POST /api/messages
 * Add a message to a conversation
 */
router.post('/', async (req, res) => {
  let conn;
  try {
    const { conversationId, type, text } = req.body;

    if (!conversationId || !type || !text) {
      return res.status(400).json({
        error: 'conversationId, type, and text are required'
      });
    }

    const id = uuidv4();
    conn = await pool.getConnection();

    // Verify conversation exists
    const conversations = await conn.query(
      'SELECT id FROM conversations WHERE id = ?',
      [conversationId]
    );

    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Insert message
    await conn.query(
      'INSERT INTO messages (id, conversation_id, type, text) VALUES (?, ?, ?, ?)',
      [id, conversationId, type, text]
    );

    // Update conversation updated_at
    await conn.query(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [conversationId]
    );

    res.status(201).json({
      id,
      conversationId,
      type,
      text,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error adding message:', err);
    res.status(500).json({ error: 'Failed to add message' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * GET /api/messages/:conversationId
 * Get all messages for a conversation
 */
router.get('/:conversationId', async (req, res) => {
  let conn;
  try {
    const { conversationId } = req.params;
    conn = await pool.getConnection();

    const messages = await conn.query(
      'SELECT id, type, text, created_at AS createdAt FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * PUT /api/messages/:id
 * Update a message
 */
router.put('/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'text is required' });
    }

    conn = await pool.getConnection();

    const result = await conn.query(
      'UPDATE messages SET text = ? WHERE id = ?',
      [text, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ id, text, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ error: 'Failed to update message' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * DELETE /api/messages/:id
 * Delete a message
 */
router.delete('/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM messages WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

export default router;
