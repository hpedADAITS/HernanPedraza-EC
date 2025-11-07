import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to manage scroll restoration and focus management
 * on browser back/forward navigation
 */
export const useHistoryState = () => {
  const location = useLocation();
  const scrollPositions = useRef({});

  // Store scroll position before navigation
  useEffect(() => {
    const handleScroll = () => {
      const scrollableElements = document.querySelectorAll("[data-preserve-scroll]");
      scrollableElements.forEach((element) => {
        const key = element.getAttribute("data-preserve-scroll");
        scrollPositions.current[key] = element.scrollTop;
      });
    };

    const scrollElements = document.querySelectorAll("[data-preserve-scroll]");
    scrollElements.forEach((element) => {
      element.addEventListener("scroll", handleScroll);
    });

    return () => {
      scrollElements.forEach((element) => {
        element.removeEventListener("scroll", handleScroll);
      });
    };
  }, []);

  // Restore scroll position when route changes
  useEffect(() => {
    const restoreScroll = () => {
      setTimeout(() => {
        const scrollableElements = document.querySelectorAll("[data-preserve-scroll]");
        scrollableElements.forEach((element) => {
          const key = element.getAttribute("data-preserve-scroll");
          if (scrollPositions.current[key]) {
            element.scrollTop = scrollPositions.current[key];
          }
        });
      }, 0);
    };

    restoreScroll();
  }, [location]);

  // Focus management
  const setFocus = useCallback((elementId) => {
  setTimeout(() => {
  const element = document.getElementById(elementId);
  if (element) {
  element.focus();
  }
  }, 0);
  }, []);

  return {
    setFocus,
    scrollPositions,
  };
};
