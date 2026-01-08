const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

/**
 * AI Service - LMStudio Integration
 * Enriches technical descriptions with AI-generated summaries
 */

const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:1234/v1';
const AI_MODEL_NAME = process.env.AI_MODEL_NAME || 'local-model';

/**
 * Generate enriched description for a Java class or method
 * @param {string} codeSnippet - The Java code to analyze
 * @param {string} context - Additional context about the code
 * @returns {Promise<string>} - AI-generated description
 */
async function enrichDescription(codeSnippet, context = '') {
  try {
    const prompt = `
Analyze the following Java code and provide a technical description in Spanish:

Code:
${codeSnippet}

Context:
${context}

Provide a concise, technical description in Spanish of what this code does, its purpose, and any important details.
`;

    const response = await axios.post(`${AI_MODEL_URL}/chat/completions`, {
      model: AI_MODEL_NAME,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return 'Unable to generate AI description at this time.';
  }
}

/**
 * Generate a summary for a Java class
 * @param {string} className - Class name
 * @param {string} methods - List of method signatures
 * @returns {Promise<string>} - AI-generated summary
 */
async function generateClassSummary(className, methods) {
  try {
    const methodList = methods.join('\n  - ');
    const prompt = `
    Summarize this Java class in one sentence in Spanish:

    Class: ${className}
    Methods:
    - ${methodList}

    Provide only the summary in Spanish, no additional text.
    `;

    const response = await axios.post(`${AI_MODEL_URL}/chat/completions`, {
      model: AI_MODEL_NAME,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 150
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    return `Utility class: ${className}`;
  }
}

module.exports = {
  enrichDescription,
  generateClassSummary
};
