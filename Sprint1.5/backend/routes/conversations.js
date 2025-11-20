import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/conversations
 * Get all conversations for a user
 */
router.get('/', async (req, res) => {
  let conn;
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    conn = await pool.getConnection();
    const conversations = await conn.query(
      'SELECT id, title, created_at AS createdAt, share_token AS shareToken FROM conversations WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(conversations);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * GET /api/conversations/:id
 * Get a specific conversation with its messages
 */
router.get('/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();

    // Get conversation
    const conversations = await conn.query(
      'SELECT id, title, created_at AS createdAt, share_token AS shareToken FROM conversations WHERE id = ?',
      [id]
    );

    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const conversation = conversations[0];

    // Get messages
    const messages = await conn.query(
      'SELECT id, type, text FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [id]
    );

    res.json({
      ...conversation,
      messages
    });
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * POST /api/conversations
 * Create a new conversation
 */
router.post('/', async (req, res) => {
  let conn;
  try {
    const { title, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const id = uuidv4();
    conn = await pool.getConnection();

    // Create conversation
    await conn.query(
      'INSERT INTO conversations (id, title, user_id) VALUES (?, ?, ?)',
      [id, title || `Chat ${new Date().toLocaleDateString()}`, userId]
    );

    // Add initial greeting message
    await conn.query(
      'INSERT INTO messages (id, conversation_id, type, text) VALUES (?, ?, ?, ?)',
      [uuidv4(), id, 'bot', '👋 Hi! I\'m Botak. Ask me anything!']
    );

    res.status(201).json({
      id,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      shareToken: null,
      messages: [
        {
          type: 'bot',
          text: '👋 Hi! I\'m Botak. Ask me anything!'
        }
      ]
    });
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * PUT /api/conversations/:id
 * Update a conversation (title, etc.)
 */
router.put('/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }

    conn = await pool.getConnection();

    const result = await conn.query(
      'UPDATE conversations SET title = ? WHERE id = ?',
      [title, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ id, title, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error updating conversation:', err);
    res.status(500).json({ error: 'Failed to update conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * DELETE /api/conversations/:id
 * Delete a conversation and all its messages
 */
router.delete('/:id', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM conversations WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    res.status(500).json({ error: 'Failed to delete conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * POST /api/conversations/:id/duplicate
 * Duplicate a conversation with all its messages
 */
router.post('/:id/duplicate', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    conn = await pool.getConnection();

    // Get original conversation
    const conversations = await conn.query(
      'SELECT * FROM conversations WHERE id = ?',
      [id]
    );

    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const original = conversations[0];
    const newId = uuidv4();

    // Create new conversation
    await conn.query(
      'INSERT INTO conversations (id, title, user_id) VALUES (?, ?, ?)',
      [newId, `${original.title} (Copy)`, userId]
    );

    // Get and copy messages
    const messages = await conn.query(
      'SELECT type, text FROM messages WHERE conversation_id = ?',
      [id]
    );

    for (const msg of messages) {
      await conn.query(
        'INSERT INTO messages (id, conversation_id, type, text) VALUES (?, ?, ?, ?)',
        [uuidv4(), newId, msg.type, msg.text]
      );
    }

    res.status(201).json({
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      shareToken: null,
      messages
    });
  } catch (err) {
    console.error('Error duplicating conversation:', err);
    res.status(500).json({ error: 'Failed to duplicate conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * POST /api/conversations/:id/share
 * Generate a share token for a conversation
 */
router.post('/:id/share', async (req, res) => {
  let conn;
  try {
    const { id } = req.params;
    const shareToken = Buffer.from(`${id}-${Date.now()}`).toString('base64');

    conn = await pool.getConnection();

    // Update conversation with share token
    await conn.query(
      'UPDATE conversations SET share_token = ? WHERE id = ?',
      [shareToken, id]
    );

    // Also insert into share_tokens table for better tracking
    await conn.query(
      'INSERT INTO share_tokens (token, conversation_id) VALUES (?, ?)',
      [shareToken, id]
    );

    res.json({ shareToken });
  } catch (err) {
    console.error('Error generating share token:', err);
    res.status(500).json({ error: 'Failed to generate share token' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

/**
 * GET /api/conversations/share/:token
 * Get a shared conversation
 */
router.get('/share/:token', async (req, res) => {
  let conn;
  try {
    const { token } = req.params;
    conn = await pool.getConnection();

    // Get conversation by share token
    const conversations = await conn.query(
      'SELECT id, title, created_at AS createdAt, share_token AS shareToken FROM conversations WHERE share_token = ?',
      [token]
    );

    if (conversations.length === 0) {
      return res.status(404).json({ error: 'Share token not found' });
    }

    const conversation = conversations[0];

    // Get messages
    const messages = await conn.query(
      'SELECT id, type, text FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversation.id]
    );

    res.json({
      ...conversation,
      messages
    });
  } catch (err) {
    console.error('Error fetching shared conversation:', err);
    res.status(500).json({ error: 'Failed to fetch shared conversation' });
  } finally {
    if (conn) {
      await conn.end();
    }
  }
});

export default router;
