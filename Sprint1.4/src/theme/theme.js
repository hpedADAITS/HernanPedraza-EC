import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90CAF9", dark: "#42a5f5" },
    background: { default: "#121212", paper: "#1E1E1E" },
    text: { primary: "#E0E0E0" },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2", dark: "#115293" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
    text: { primary: "#000000" },
  },
});
