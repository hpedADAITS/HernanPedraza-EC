import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { darkTheme, lightTheme } from "./theme/theme";
import Header from "./components/Layout/Header";
import ChatWindow from "./components/Chatbot/ChatWindow";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
        <ChatWindow />
      </Box>
    </ThemeProvider>
  );
}
