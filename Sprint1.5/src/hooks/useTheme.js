import { useState, useEffect, useRef } from 'react';

const THEME_KEY = 'app-theme-mode';
const THEME_CHANNEL = 'theme-channel';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved ? JSON.parse(saved) : true; // default to dark mode
  });

  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    // Create BroadcastChannel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(THEME_CHANNEL);

      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'THEME_CHANGE') {
          setIsDarkMode(event.data.isDarkMode);
        }
      };
    }

    // Listen for storage changes as fallback
    const handleStorageChange = (e) => {
      if (e.key === THEME_KEY && e.newValue !== null) {
        setIsDarkMode(JSON.parse(e.newValue));
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

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;

      // Save to localStorage
      localStorage.setItem(THEME_KEY, JSON.stringify(newValue));

      // Broadcast to other tabs
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'THEME_CHANGE',
          isDarkMode: newValue
        });
      }

      return newValue;
    });
  };

  return { isDarkMode, toggleTheme };
};
