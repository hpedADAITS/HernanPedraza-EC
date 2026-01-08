import React, { useState } from 'react';
import axios from 'axios';
import './RepositoryUpload.css';

function RepositoryUpload({ onProcessComplete, onStartProcessing, isLoading }) {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!repositoryUrl.trim()) {
      setError('La URL del repositorio es requerida');
      return;
    }

    if (!repositoryUrl.includes('git') && !repositoryUrl.includes('github')) {
      setError('Por favor proporciona una URL de repositorio Git válida');
      return;
    }

    onStartProcessing();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/repository/process`,
        {
          repositoryUrl: repositoryUrl.trim(),
          branch: branch.trim() || 'main'
        },
        {
          timeout: 300000 // 5 minute timeout
        }
      );

      if (response.data.success) {
        setSuccess(`✓ ¡Documentación generada exitosamente!`);
        setRepositoryUrl('');
        setBranch('main');

        // Pass result to parent
        onProcessComplete({
          id: response.data.id,
          repositoryUrl,
          branch,
          timestamp: new Date().toISOString(),
          statistics: response.data.statistics,
          documentation: response.data.documentation,
          status: 'completed'
        });
      } else {
        setError(`La generación falló: ${response.data.error}`);
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'Entrada inválida');
      } else if (err.code === 'ECONNREFUSED') {
        setError('No se puede conectar al backend. ¿El servidor se ejecuta en el puerto 3000?');
      } else if (err.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado. El repositorio puede ser muy grande o la red es lenta.');
      } else {
        setError(err.response?.data?.message || err.message || 'Fallo al procesar el repositorio');
      }
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Generar Documentación desde Repositorio Git</h2>
        <p className="description">
          Proporciona una URL de repositorio Git público y generaremos documentación Java completa
          con diagramas PlantUML y archivos Markdown.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="repo-url">URL del Repositorio *</label>
            <input
              id="repo-url"
              type="text"
              placeholder="https://github.com/user/repo.git"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              disabled={isLoading}
              className="form-input"
            />
            <small>URLs HTTPS o SSH soportadas</small>
          </div>

          <div className="form-group">
            <label htmlFor="branch">Rama (opcional)</label>
            <input
              id="branch"
              type="text"
              placeholder="main"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={isLoading}
              className="form-input"
            />
            <small>Por defecto 'main' si no se especifica</small>
          </div>

          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Procesando...
              </>
            ) : (
              '🚀 Generar Documentación'
            )}
          </button>
        </form>

        <div className="info-box">
          <h3>Cómo funciona</h3>
          <ol>
            <li><strong>Clonar:</strong> Git clona tu repositorio a almacenamiento temporal</li>
            <li><strong>Descubrir:</strong> Encuentra recursivamente todos los archivos Java (.java)</li>
            <li><strong>Analizar:</strong> Analiza cada archivo independientemente para extraer clases, métodos, campos y relaciones</li>
            <li><strong>Enriquecer:</strong> El modelo de IA genera descripciones técnicas para clases y métodos</li>
            <li><strong>Agregar:</strong> Combina todas las estructuras y contexto enriquecido por IA</li>
            <li><strong>Generar:</strong> Crea documentos Markdown completos y diagramas UML PlantUML</li>
            <li><strong>Mostrar:</strong> Ver, exportar y descargar tu documentación</li>
          </ol>
        </div>

        <div className="examples-box">
          <h3>Repositorios de ejemplo</h3>
          <ul>
            <li><code>https://github.com/google/guava.git</code></li>
            <li><code>https://github.com/apache/commons-lang.git</code></li>
            <li><code>https://github.com/junit-team/junit4.git</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RepositoryUpload;
