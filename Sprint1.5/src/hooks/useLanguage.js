import { useState, useEffect, useRef } from 'react';

const LANGUAGE_KEY = 'app-language';
const LANGUAGE_CHANNEL = 'language-channel';

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY);
    return saved || 'en'; // default to English
  });

  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    // Create BroadcastChannel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(LANGUAGE_CHANNEL);

      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'LANGUAGE_CHANGE') {
          setLanguage(event.data.language);
        }
      };
    }

    // Listen for storage changes as fallback
    const handleStorageChange = (e) => {
      if (e.key === LANGUAGE_KEY && e.newValue !== null) {
        setLanguage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const changeLanguage = (newLanguage) => {
    // Save to localStorage
    localStorage.setItem(LANGUAGE_KEY, newLanguage);

    // Broadcast to other tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'LANGUAGE_CHANGE',
        language: newLanguage
      });
    }

    setLanguage(newLanguage);
  };

  return { language, changeLanguage };
};
