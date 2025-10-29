import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { darkTheme, lightTheme } from "./styles/theme";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import ChatWindow from "./components/Chatbot/ChatWindow";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("pokeapi");
  const [chatStarted, setChatStarted] = useState(false);

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleSelectEndpoint = (endpoint) => setSelectedEndpoint(endpoint);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onMenuClick={handleToggleSidebar}
          chatStarted={chatStarted}
        />
        <Sidebar
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onSelectEndpoint={handleSelectEndpoint}
        />
        <ChatWindow
          endpoint={selectedEndpoint}
          onChatStateChange={setChatStarted}
        />
      </Box>
    </ThemeProvider>
  );
}
