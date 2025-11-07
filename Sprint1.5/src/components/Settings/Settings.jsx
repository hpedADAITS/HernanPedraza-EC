import React from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const Settings = ({ isDarkMode, onToggleTheme, onLogout, currentUser }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Settings
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Account
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Logged in as: {currentUser}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={onToggleTheme}
              color="primary"
            />
          }
          label="Dark Mode"
        />
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          More settings coming soon...
        </Typography>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          fullWidth
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
