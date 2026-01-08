import React from 'react';
import './History.css';

function History({ items, onSelectItem }) {
  if (items.length === 0) {
    return (
      <div className="history-empty">
        <p>No processing history yet. Generate your first documentation!</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2>Processing History</h2>
      <p className="history-description">
        Your {items.length} most recent documentation generations
      </p>

      <div className="history-list">
        {items.map((item, index) => (
          <HistoryItem
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            onSelect={() => onSelectItem(item)}
          />
        ))}
      </div>
    </div>
  );
}

function HistoryItem({ item, index, onSelect }) {
  const timestamp = new Date(item.timestamp);
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div className="history-item">
      <div className="history-item-header">
        <div className="item-number">#{index + 1}</div>
        <div className="item-title">
          <h3>{item.repositoryUrl.split('/').pop().replace('.git', '')}</h3>
          <p className="item-url">{item.repositoryUrl}</p>
        </div>
        <div className="item-time">
          <span className="time-relative">{timeAgo}</span>
          <span className="time-full">{timestamp.toLocaleString()}</span>
        </div>
      </div>

      <div className="history-item-stats">
        <div className="history-stat">
          <span className="stat-icon">📁</span>
          <span>{item.statistics.filesFound} Java files</span>
        </div>
        <div className="history-stat">
          <span className="stat-icon">📚</span>
          <span>{item.statistics.classesFound} classes</span>
        </div>
        <div className="history-stat">
          <span className="stat-icon">🔗</span>
          <span>{item.statistics.interfacesFound} interfaces</span>
        </div>
        <div className="history-stat">
          <span className="stat-icon">🌿</span>
          <span>Branch: {item.branch}</span>
        </div>
      </div>

      <div className="history-item-footer">
        <span className={`status-badge ${item.status}`}>
          {item.status === 'completed' ? '✓ Completed' : 'Processing...'}
        </span>
        <button className="view-button" onClick={onSelect}>
          View Results →
        </button>
      </div>
    </div>
  );
}

function getTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return interval === 1 ? `1 ${key} ago` : `${interval} ${key}s ago`;
    }
  }

  return 'Just now';
}

export default History;
