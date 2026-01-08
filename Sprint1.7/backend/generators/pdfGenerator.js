/**
 * PDF Documentation Generator
 * Converts Markdown to PDF using Puppeteer (headless browser)
 */

const puppeteer = require('puppeteer');
const marked = require('marked');

/**
 * Convert Markdown content to PDF Buffer
 * @param {string} markdownContent - Markdown documentation content
 * @returns {Promise<Buffer>} - PDF as Buffer
 */
async function markdownToPdfBuffer(markdownContent) {
  let browser;
  try {
    console.log('[PDF Generator] Converting markdown to PDF...');
    
    // Convert markdown to HTML
    const html = marked.parse(markdownContent);
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Java Documentation</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 8px;
    }
    h1 { font-size: 28px; border-bottom: 2px solid #000; }
    h2 { font-size: 24px; }
    h3 { font-size: 20px; }
    code {
      background-color: #f6f8fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 6px;
      padding: 16px;
      overflow-x: auto;
      margin: 16px 0;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    table th,
    table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
    }
    ul, ol {
      margin: 16px 0;
      padding-left: 32px;
    }
    li {
      margin: 8px 0;
    }
    @page {
      margin: 20mm;
      @bottom-center {
        content: "Page " counter(page);
        font-size: 12px;
        color: #999;
      }
    }
  </style>
</head>
<body>
${html}
</body>
</html>
    `;

    // Launch headless browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });

    console.log('[PDF Generator] PDF generated successfully');
    return pdfBuffer;
  } catch (error) {
    console.error('[PDF Generator] Error converting markdown to PDF:', error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  markdownToPdfBuffer
};
