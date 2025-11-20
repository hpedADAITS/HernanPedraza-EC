import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTranslation } from "../../hooks/useTranslation";

/**
 * AppLayout Component
 * 
 * Provides consistent visual structure for the application:
 * - Flexible main content area
 * - Persistent bottom navigation for mobile/tablet
 * - Auto-hides navigation on detail views (conversation view)
 * 
 * @param {React.ReactNode} children - Main content to render
 * @param {string} currentUser - Current authenticated user
 */
const AppLayout = ({ children, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Determine current tab based on route
  const getCurrentTab = () => {
    if (location.pathname.startsWith("/conversation")) return null;
    if (location.pathname.includes("/conversations")) return "conversations";
    if (location.pathname.includes("/pokedex")) return "pokedex";
    if (location.pathname.includes("/settings")) return "settings";
    return null;
  };

  // Handle bottom navigation tab changes
  const handleTabChange = (event, newValue) => {
    navigate(`/${currentUser}/${newValue}`);
  };

  const currentTab = getCurrentTab();
  const showBottomNav = currentTab !== null;

  // Restore scroll position on mount (if stored)
  useEffect(() => {
    const scrollKey = `scroll-${location.pathname}`;
    const savedScroll = sessionStorage.getItem(scrollKey);
    if (savedScroll) {
      // Defer scroll restoration to allow DOM to render
      setTimeout(() => {
        const element = document.querySelector("[data-preserve-scroll]");
        if (element) {
          element.scrollTop = parseInt(savedScroll, 10);
        }
      }, 0);
    }
  }, [location.pathname]);

  // Save scroll position before leaving
  useEffect(() => {
    return () => {
      const element = document.querySelector("[data-preserve-scroll]");
      if (element) {
        const scrollKey = `scroll-${location.pathname}`;
        sessionStorage.setItem(scrollKey, element.scrollTop);
      }
    };
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        overflow: "hidden",
      }}
    >
      {/* Main Content Area */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {children}
      </Box>

      {/* Bottom Navigation (shows on list/settings views, hidden on detail views) */}
      {showBottomNav && (
        <BottomNavigation
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
            position: "sticky",
            bottom: 0,
          }}
        >
          <BottomNavigationAction
            label={t("conversations")}
            value="conversations"
            icon={<ChatIcon />}
          />
          <BottomNavigationAction
            label={t("pokedex")}
            value="pokedex"
            icon={<CatchingPokemonIcon />}
          />
          <BottomNavigationAction
            label={t("settings")}
            value="settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default AppLayout;
