/**
 * Repository API Routes
 * Handles Git repository cloning and processing endpoints
 */

const express = require('express');
const { cloneAndProcess } = require('../services/repositoryService');
const docsRoutes = require('./docsRoutes');

const router = express.Router();

/**
 * POST /api/repository/process
 * Clone a Git repository and generate documentation
 * Body: { repositoryUrl: string, branch?: string }
 */
router.post('/process', async (req, res) => {
  try {
    const { repositoryUrl, branch = 'main' } = req.body;

    // Validate input
    if (!repositoryUrl) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'repositoryUrl is required'
      });
    }

    // Validate URL format (basic check)
    if (!repositoryUrl.includes('git') && !repositoryUrl.includes('github')) {
      return res.status(400).json({
        error: 'Invalid repository URL',
        message: 'Must be a valid Git repository URL'
      });
    }

    console.log(`\n[API] Repository processing request: ${repositoryUrl}`);

    // Start processing asynchronously
    const result = await cloneAndProcess(repositoryUrl, branch);

    if (result.success) {
      // Store documentation with PDF generation
      try {
        const docName = `${repositoryUrl.split('/').pop().replace('.git', '')}_${result.id}`;
        await docsRoutes.storeDocumentation(
          result.id,
          docName,
          result.documentation.markdown
        );
        console.log(`[API] Documentation stored with ID: ${result.id}`);
      } catch (storageError) {
        console.error(`[API] Error storing documentation: ${storageError.message}`);
        // Continue anyway - documentation exists even if storage failed
      }

      res.json({
        success: true,
        id: result.id,
        message: 'Repository processed successfully',
        statistics: result.statistics,
        aiEnabled: result.statistics.aiEnabled,
        aiEnrichments: result.statistics.aiEnrichments,
        documentation: {
          markdownPath: result.documentation.markdownPath,
          pumlPath: result.documentation.pumlPath,
          aiMetadataPath: result.documentation.aiMetadataPath
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        phase: result.phase,
        message: `Failed during ${result.phase} phase`,
        aiEnabled: result.statistics?.aiEnabled || false
      });
    }
  } catch (error) {
    console.error('[API] Error in repository processing:', error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

/**
 * GET /api/repository/status/:id
 * Get processing status and results
 */
router.get('/status/:id', (req, res) => {
  const { id } = req.params;

  // TODO: Implement status tracking with job queue
  res.json({
    id,
    status: 'pending',
    message: 'Status tracking not yet implemented'
  });
});

/**
 * POST /api/repository/file
 * Upload and process a local Java file/folder
 * Form data: file (file), type (file or directory)
 */
router.post('/file', (req, res) => {
  // TODO: Implement local file upload and processing
  res.json({
    message: 'File upload not yet implemented'
  });
});

module.exports = router;
