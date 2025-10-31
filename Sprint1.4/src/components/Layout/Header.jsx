import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { darkTheme, lightTheme } from "../../theme/theme";
import EndpointSelector from "./EndpointSelector";

const Header = ({ isDarkMode, onToggleTheme, currentEndpoint, onEndpointChange }) => {
  return (
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <EndpointSelector
            currentEndpoint={currentEndpoint}
            onEndpointChange={onEndpointChange}
          />
          <IconButton color="inherit" onClick={onToggleTheme}>
            <DarkModeIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
