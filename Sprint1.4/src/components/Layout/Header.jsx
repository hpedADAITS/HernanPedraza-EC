import React from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MenuIcon from "@mui/icons-material/Menu";
import { darkTheme, lightTheme } from "../../styles/theme";

const Header = ({ isDarkMode, onToggleTheme, chatStarted }) => {
  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar>
        {chatStarted && (
          <>
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
          </>
        )}
        <IconButton color="inherit" onClick={onToggleTheme}>
          <DarkModeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
