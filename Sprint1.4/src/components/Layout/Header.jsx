import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, Divider } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsIcon from "@mui/icons-material/Settings";
import { darkTheme, lightTheme } from "../../theme/theme";
import EndpointSelector from "./EndpointSelector";

const Header = ({ isDarkMode, onToggleTheme, currentEndpoint, onEndpointChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
          <IconButton color="inherit" onClick={handleSettingsClick}>
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" onClick={onToggleTheme}>
            <DarkModeIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <EndpointSelector
              currentEndpoint={currentEndpoint}
              onEndpointChange={onEndpointChange}
            />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ textAlign: 'center', pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Made by Hernan
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                for Sprint 1.4
              </Typography>
            </Box>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
