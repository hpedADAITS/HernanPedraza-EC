import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CatchingPokemonIcon from "@mui/icons-material/CatchingPokemon";
import SettingsIcon from "@mui/icons-material/Settings";
import { darkTheme, lightTheme } from "./theme/theme";
import { useTheme } from "./hooks/useTheme";
import { useTranslation } from "./hooks/useTranslation";
import ConversationView from "./components/Chatbot/ConversationView";
import ConversationsView from "./components/ChatHistory/ConversationsView";
import Pokedex from "./components/Pokedex/Pokedex";
import Settings from "./components/Settings/Settings";
import Login from "./components/Auth/Login";
import NotFound from "./components/Error/NotFound";
import SharedConversationView from "./components/Shared/SharedConversationView";

// Protected Route Component
const ProtectedRoute = ({ isLoggedIn, children }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const MainLayout = ({ isDarkMode, onToggleTheme, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const getCurrentTab = () => {
    if (location.pathname.startsWith("/conversation")) return null;
    if (location.pathname.includes("/conversations")) return "conversations";
    if (location.pathname.includes("/pokedex")) return "pokedex";
    if (location.pathname.includes("/settings")) return "settings";
    return "conversations";
  };

  const handleTabChange = (event, newValue) => {
    navigate(`/${currentUser}/${newValue}`);
  };

  const currentTab = getCurrentTab();
  const showBottomNav = currentTab !== null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
      }}
    >
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to={`/${currentUser}/conversations`} replace /> : <Navigate to="/login" replace />} />
          <Route path="/:userId/conversations" element={<ConversationsView currentUser={currentUser} onLogout={onLogout} />} />
          <Route path="/conversation/:conversationId" element={<ConversationView isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} currentUser={currentUser} onLogout={onLogout} />} />
          <Route path="/:userId/pokedex" element={<Pokedex />} />
          <Route path="/:userId/settings" element={<Settings isDarkMode={isDarkMode} onToggleTheme={onToggleTheme} onLogout={onLogout} currentUser={currentUser} />} />
          <Route path="*" element={<NotFound currentUser={currentUser} />} />
        </Routes>
      </Box>
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
            label={t('conversations')}
            value="conversations"
            icon={<ChatIcon />}
          />
          <BottomNavigationAction
            label={t('pokedex')}
            value="pokedex"
            icon={<CatchingPokemonIcon />}
          />
          <BottomNavigationAction
            label={t('settings')}
            value="settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const handleLoginSuccess = (username) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={(username) => handleLoginSuccess(username)} />} />
          <Route path="/share/:shareToken" element={<SharedConversationView />} />
          <Route path="/*" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MainLayout isDarkMode={isDarkMode} onToggleTheme={toggleTheme} onLogout={handleLogout} currentUser={currentUser} />
            </ProtectedRoute>
          } />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
