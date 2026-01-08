const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfGenerator = require('../generators/pdfGenerator');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  dest: path.join(__dirname, '../uploads'),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// In-memory store for documentation (replace with database)
const docs = new Map();

/**
 * Store documentation with markdown, PDF, and diagram
 * @param {string} id - Document ID
 * @param {string} name - Document name
 * @param {string} markdown - Markdown content
 * @param {string|null} diagramImagePath - Path to diagram PNG image (optional)
 * @returns {Promise<Object>} - Stored document
 */
async function storeDocumentation(id, name, markdown, diagramImagePath = null) {
  const config = require('../config/config');
  try {
    // Generate PDF from markdown
    let pdfBuffer = null;
    let pdfPath = null;
    try {
      pdfBuffer = await pdfGenerator.markdownToPdfBuffer(markdown);
      console.log(`[DocsAPI] PDF generated successfully for ${id}`);
      
      // Also save PDF to disk
      const outputDir = path.join(config.outputDir, `repo-${id}`);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      pdfPath = path.join(outputDir, `documentation.pdf`);
      fs.writeFileSync(pdfPath, pdfBuffer);
      console.log(`[DocsAPI] PDF saved to disk: ${pdfPath}`);
    } catch (pdfError) {
      console.error(`[DocsAPI] Failed to generate PDF: ${pdfError.message}`);
      // Continue without PDF - markdown-only mode
    }

    // Load diagram image if available
    let diagramImageBuffer = null;
    if (diagramImagePath && fs.existsSync(diagramImagePath)) {
      try {
        diagramImageBuffer = fs.readFileSync(diagramImagePath);
        console.log(`[DocsAPI] Diagram image loaded: ${diagramImagePath}`);
      } catch (imgError) {
        console.error(`[DocsAPI] Failed to load diagram image: ${imgError.message}`);
      }
    }

    const docEntry = {
      id,
      name,
      timestamp: new Date(),
      markdown,
      pdf: pdfBuffer,
      pdfPath,
      diagramImage: diagramImageBuffer,
      diagramImagePath,
      status: 'completed'
    };

    docs.set(id, docEntry);
    return docEntry;
  } catch (error) {
    console.error(`[DocsAPI] Error storing documentation:`, error.message);
    throw error;
  }
}

/**
 * GET /api/docs/:id
 * Retrieve generated documentation (PDF, Markdown, or diagram image) by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const { format } = req.query; // 'pdf', 'md', or 'png'

  const doc = docs.get(id);
  
  if (!doc) {
    return res.status(404).json({ error: 'Documentation not found' });
  }

  if (format === 'pdf') {
    if (!doc.pdf) {
      return res.status(400).json({ error: 'PDF not available. Generate documentation first.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.name}.pdf"`);
    res.send(doc.pdf);
  } else if (format === 'md') {
    if (!doc.markdown) {
      return res.status(400).json({ error: 'Markdown not available' });
    }
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.name}.md"`);
    res.send(doc.markdown);
  } else if (format === 'png') {
    if (!doc.diagramImage) {
      return res.status(400).json({ error: 'Diagram image not available' });
    }
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="${doc.name}-diagram.png"`);
    res.send(doc.diagramImage);
  } else {
    return res.status(400).json({ error: 'Invalid format. Use "pdf", "md", or "png"' });
  }
});

/**
 * POST /api/docs
 * Upload Java source code and generate documentation
 */
router.post('/', upload.single('javaFile'), async (req, res) => {
  try {
    const docId = uuidv4();
    const { fileName } = req.body;

    // TODO: Implement Java analysis
    // TODO: Generate PlantUML diagrams
    // TODO: Generate Markdown
    // TODO: Convert to PDF

    const docEntry = {
      id: docId,
      name: fileName || 'documentation',
      timestamp: new Date(),
      markdown: '# Generated Documentation\n\nPending implementation',
      pdf: null,
      status: 'pending'
    };

    docs.set(docId, docEntry);

    res.json({ 
      id: docId,
      message: 'Documentation generation started',
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process file', message: error.message });
  }
});

/**
 * GET /api/docs
 * List all generated documentation (for history)
 */
router.get('/', (req, res) => {
  const history = Array.from(docs.values()).map(doc => ({
    id: doc.id,
    name: doc.name,
    timestamp: doc.timestamp,
    status: doc.status
  }));

  res.json({ docs: history });
});

module.exports = router;
module.exports.storeDocumentation = storeDocumentation;
