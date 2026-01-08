import React, { useState } from 'react';
import './App.css';
import RepositoryUpload from './components/RepositoryUpload';
import Results from './components/Results';
import History from './components/History';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleProcessComplete = (result) => {
    setCurrentResult(result);
    setHistory([result, ...history]);
    setActiveTab('results');
    setLoading(false);
  };

  const handleStartProcessing = () => {
    setLoading(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Generador de Documentación Java</h1>
          <p className="subtitle">Documentación automática de API desde repositorios Git</p>
        </div>
      </header>

      <div className="app-container">
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📤 Nueva Generación
          </button>
          <button
            className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
            disabled={!currentResult}
          >
            📊 Resultados
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
            disabled={history.length === 0}
          >
            📜 Historial ({history.length})
          </button>
        </nav>

        <main className="tab-content">
          {activeTab === 'upload' && (
            <RepositoryUpload
              onProcessComplete={handleProcessComplete}
              onStartProcessing={handleStartProcessing}
              isLoading={loading}
            />
          )}
          {activeTab === 'results' && currentResult && (
            <Results result={currentResult} />
          )}
          {activeTab === 'history' && (
            <History
              items={history}
              onSelectItem={(item) => {
                setCurrentResult(item);
                setActiveTab('results');
              }}
            />
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; 2024 Generador de Documentación Java • Impulsado por React, Node.js y PlantUML</p>
      </footer>
    </div>
  );
}

export default App;
