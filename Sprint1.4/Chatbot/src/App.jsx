import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90CAF9',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#B0B0B0',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: '#90CAF9',
    },
    h6: {
      fontWeight: 400,
      color: '#B0B0B0',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#1E1E1E',
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25,
        },
      },
    },
  },
});


const StyledButton = styled(Button)(({ theme }) => ({

  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
  border: 0,
  color: theme.palette.text.primary,
  height: 52,
  padding: '0 30px',
  boxShadow: `0 5px 15px 2px rgba(144, 202, 249, 0.25)`,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
    boxShadow: `0 8px 20px 2px rgba(144, 202, 249, 0.4)`,
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: `0 3px 10px 1px rgba(144, 202, 249, 0.2)`,
  },
}));


function App() {
  const handleStartChat = () => {
    console.log('Educational Chatbot initiated in Dark Mode!');
    alert('Welcome to your Dark Mode Learning Experience!');

  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <AutoStoriesIcon sx={{ mr: 1, color: darkTheme.palette.primary.main }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Botak
          </Typography>
          <IconButton color="inherit">
            <DarkModeIcon /> { }
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 8 }}> { }
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            p: 5,
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: `1px solid ${darkTheme.palette.divider}`,
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Unlock Knowledge, Any Time.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Your personal AI learning companion, designed for a focused and
            immersive educational journey. Explore new horizons in comfort.
          </Typography>
          <StyledButton variant="contained" onClick={handleStartChat}>
            Dive into Learning
          </StyledButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;