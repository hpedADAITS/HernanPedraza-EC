import React, { useState } from "react";
import {
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ChatWindow from "./components/Chatbot/ChatWindow";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90CAF9", dark: "#42a5f5" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#E0E0E0" },
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#000000" },
  },
});

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <AutoStoriesIcon
              sx={{
                mr: 1,
                color: isDarkMode
                  ? darkTheme.palette.primary.main
                  : lightTheme.palette.primary.main,
              }}
            />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Botak
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <ChatWindow />
      </Box>
    </ThemeProvider>
  );
}
