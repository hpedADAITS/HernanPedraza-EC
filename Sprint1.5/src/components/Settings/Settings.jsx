import React from "react";
import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTemperature } from "../../hooks/useTemperature";
import { useLanguage } from "../../hooks/useLanguage";
import { useTranslation } from "../../hooks/useTranslation";

const Settings = ({ isDarkMode, onToggleTheme, onLogout, currentUser }) => {
  const { temperature, updateTemperature } = useTemperature();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
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
          {t('settingsTitle')}
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t('account')}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('loggedInAs')}: {currentUser}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('appearance')}
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={onToggleTheme}
              color="primary"
            />
          }
          label={t('darkMode')}
        />
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('language')}
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('selectLanguage')}</InputLabel>
          <Select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            label={t('selectLanguage')}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Español</MenuItem>
          </Select>
        </FormControl>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('aiSettings')}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t('temperature')}: {temperature.toFixed(1)}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            {t('temperatureDescription')}
          </Typography>
          <Slider
            value={temperature}
            onChange={(event, newValue) => updateTemperature(newValue)}
            min={0}
            max={2}
            step={0.1}
            marks={[
              { value: 0, label: '0' },
              { value: 0.7, label: '0.7' },
              { value: 1.5, label: '1.5' },
              { value: 2, label: '2' },
            ]}
            valueLabelDisplay="auto"
            sx={{ mt: 1 }}
          />
        </Box>
        <Divider sx={{ mt: 3, mb: 2 }} />
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          fullWidth
        >
          {t('logout')}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
