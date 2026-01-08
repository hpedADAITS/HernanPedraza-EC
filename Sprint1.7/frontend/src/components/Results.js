import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';

function Results({ result }) {
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('rendered');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    loadMarkdown();
  }, [result]);

  const loadMarkdown = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/docs/${result.id}?format=md`,
        { responseType: 'text' }
      );
      setMarkdown(response.data);
    } catch (err) {
      // Fallback: Use embedded markdown from result
      if (result.documentation?.markdown) {
        setMarkdown(result.documentation.markdown);
      } else {
        setError('Fallo al cargar la documentación');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `documentation-${result.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadPDF = () => {
    window.open(
      `${API_BASE_URL}/api/docs/${result.id}?format=pdf`,
      '_blank'
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    alert('¡Documentación copiada al portapapeles!');
  };

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="result-info">
          <h2>Resultados de la Documentación</h2>
          <div className="result-meta">
            <span className="meta-item">
              <strong>Repositorio:</strong> {result.repositoryUrl}
            </span>
            <span className="meta-item">
              <strong>Rama:</strong> {result.branch}
            </span>
            <span className="meta-item">
              <strong>Generado:</strong> {new Date(result.timestamp).toLocaleString()}
            </span>
            {result.aiEnrichments > 0 && (
              <span className="meta-item ai-badge">
                <strong>🤖 Enriquecido por IA:</strong> {result.aiEnrichments} enriquecimientos
              </span>
            )}
          </div>
        </div>

        <div className="result-stats">
          <div className="stat-box">
            <div className="stat-value">{result.statistics.filesFound}</div>
            <div className="stat-label">Archivos Java</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{result.statistics.classesFound}</div>
            <div className="stat-label">Clases</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{result.statistics.interfacesFound}</div>
            <div className="stat-label">Interfaces</div>
          </div>
        </div>
      </div>

      <div className="results-controls">
        <div className="view-mode">
          <button
            className={`mode-button ${viewMode === 'rendered' ? 'active' : ''}`}
            onClick={() => setViewMode('rendered')}
          >
            📖 Renderizado
          </button>
          <button
            className={`mode-button ${viewMode === 'raw' ? 'active' : ''}`}
            onClick={() => setViewMode('raw')}
          >
            &lt;/&gt; Markdown Bruto
          </button>
        </div>

        <div className="download-buttons">
          <button className="btn btn-primary" onClick={downloadMarkdown}>
            📥 Descargar Markdown
          </button>
          <button className="btn btn-secondary" onClick={downloadPDF}>
            📑 Descargar PDF
          </button>
          <button className="btn btn-outline" onClick={copyToClipboard}>
            📋 Copiar al Portapapeles
          </button>
        </div>
      </div>

      <div className="results-content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Cargando documentación...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {viewMode === 'rendered' && (
              <div className="markdown-rendered">
                <MarkdownRenderer content={markdown} />
              </div>
            )}
            {viewMode === 'raw' && (
              <pre className="markdown-raw">
                <code>{markdown}</code>
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }) {
  const lines = content.split('\n');
  const elements = [];
  let codeBlock = false;
  let codeContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (codeBlock) {
        elements.push(
          <pre key={`code-${elements.length}`} className="code-block">
            <code>{codeContent}</code>
          </pre>
        );
        codeContent = '';
      }
      codeBlock = !codeBlock;
      continue;
    }

    if (codeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${elements.length}`} className="markdown-h1">
          {line.replace(/^#+\s/, '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${elements.length}`} className="markdown-h2">
          {line.replace(/^#+\s/, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${elements.length}`} className="markdown-h3">
          {line.replace(/^#+\s/, '')}
        </h3>
      );
    }
    // Tables
    else if (line.includes('|')) {
      // Find table end
      const tableLines = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].includes('|')) {
        tableLines.push(lines[j]);
        j++;
      }
      i = j - 1;

      elements.push(
        <table key={`table-${elements.length}`} className="markdown-table">
          <tbody>
            {tableLines.map((row, idx) => (
              <tr key={idx}>
                {row
                  .split('|')
                  .filter(cell => cell.trim())
                  .map((cell, cellIdx) => (
                    <td key={cellIdx}>
                      {cell.trim().replace(/^-+$/, '')}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // Lists
    else if (line.match(/^\s*[-*+]\s/)) {
      elements.push(
        <li key={`li-${elements.length}`} className="markdown-li">
          {line.replace(/^\s*[-*+]\s/, '')}
        </li>
      );
    }
    // Bold text
    else if (line.includes('**') || line.includes('__')) {
      const processed = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>');
      elements.push(
        <p key={`p-${elements.length}`} className="markdown-p">
          <span dangerouslySetInnerHTML={{ __html: processed }} />
        </p>
      );
    }
    // Regular paragraph
    else if (line.trim()) {
      elements.push(
        <p key={`p-${elements.length}`} className="markdown-p">
          {line}
        </p>
      );
    }
  }

  return <div className="markdown-content">{elements}</div>;
}

export default Results;
