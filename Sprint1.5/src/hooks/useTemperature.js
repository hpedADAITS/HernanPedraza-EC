import { useState, useEffect, useRef } from 'react';

const TEMPERATURE_KEY = 'lmstudio-temperature';
const TEMPERATURE_CHANNEL = 'temperature-channel';

export const useTemperature = () => {
  const [temperature, setTemperature] = useState(() => {
    const saved = localStorage.getItem(TEMPERATURE_KEY);
    return saved ? parseFloat(saved) : 0.7; // default temperature
  });

  const broadcastChannelRef = useRef(null);

  useEffect(() => {
    // Create BroadcastChannel for cross-tab communication
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel(TEMPERATURE_CHANNEL);

      broadcastChannelRef.current.onmessage = (event) => {
        if (event.data.type === 'TEMPERATURE_CHANGE') {
          setTemperature(event.data.temperature);
        }
      };
    }

    // Listen for storage changes as fallback
    const handleStorageChange = (e) => {
      if (e.key === TEMPERATURE_KEY && e.newValue !== null) {
        setTemperature(parseFloat(e.newValue));
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

  const updateTemperature = (newTemperature) => {
    const clampedValue = Math.max(0, Math.min(2, newTemperature)); // Clamp between 0 and 2

    // Save to localStorage
    localStorage.setItem(TEMPERATURE_KEY, clampedValue.toString());

    // Broadcast to other tabs
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'TEMPERATURE_CHANGE',
        temperature: clampedValue
      });
    }

    setTemperature(clampedValue);
  };

  return { temperature, updateTemperature };
};
