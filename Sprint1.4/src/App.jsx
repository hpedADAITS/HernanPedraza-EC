import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { darkTheme, lightTheme } from "./theme/theme";
import Header from "./components/Layout/Header";
import ChatWindow from "./components/Chatbot/ChatWindow";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentEndpoint, setCurrentEndpoint] = useState("pokeapi");

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        pt: 'env(safe-area-inset-top)',
        pl: 'env(safe-area-inset-left)',
        pr: 'env(safe-area-inset-right)',
      }}>
        <Header 
          isDarkMode={isDarkMode} 
          onToggleTheme={handleToggleTheme}
          currentEndpoint={currentEndpoint}
          onEndpointChange={setCurrentEndpoint}
        />
        <ChatWindow 
          currentEndpoint={currentEndpoint}
          onEndpointChange={setCurrentEndpoint}
        />
      </Box>
    </ThemeProvider>
  );
}
