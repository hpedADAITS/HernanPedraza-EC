/**
 * Configuration Module
 * Centralized configuration management
 */

const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({
  path: path.join(__dirname, '../.env')
});

const config = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8978',

  // AI Model
  aiModelUrl: process.env.AI_MODEL_URL || 'http://localhost:1234/v1',
  aiModelName: process.env.AI_MODEL_NAME || 'local-model',
  aiTimeout: 30000, // 30 seconds

  // File Upload
  maxFileSize: process.env.MAX_FILE_SIZE || 52428800, // 50MB
  uploadDir: path.join(__dirname, '../uploads'),
  outputDir: path.join(__dirname, '../outputs'),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',

  // Database
  databaseUrl: process.env.DATABASE_URL || null,

  // Features
  features: {
    aiEnrichment: true,
    pdfGeneration: true,
    plantumlGeneration: true
  }
};

// Ensure directories exist
const fs = require('fs');
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

module.exports = config;
