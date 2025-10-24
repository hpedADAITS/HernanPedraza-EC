import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  CssBaseline,
  IconButton,
  TextField,
  Paper,
  createTheme,
  ThemeProvider,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90CAF9', dark: '#42a5f5' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#E0E0E0', secondary: '#B0B0B0' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { color: '#B0B0B0' },
  },
});

const MessageBubble = styled(Paper)(({ theme, isUser }) => ({
  position: 'relative',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  backgroundColor: isUser
    ? theme.palette.primary.dark
    : theme.palette.background.paper,
  color: isUser ? '#fff' : theme.palette.text.primary,
  padding: '10px 15px',
  borderRadius: 10,
  maxWidth: '75%',
  marginBottom: 16,
  boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
  fontSize: '1rem',
  lineHeight: 1.4,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    ...(isUser
      ? {
        borderWidth: '10px 0 10px 10px',
        borderColor: `transparent transparent transparent ${darkTheme.palette.primary.dark}`,
        right: -9,
        top: 13,
      }
      : {
        borderWidth: '10px 10px 10px 0',
        borderColor: `transparent ${darkTheme.palette.background.paper} transparent transparent`,
        left: -9,
        top: 13,
      }),
  },
}));



export default function App() {
  const [messages, setMessages] = useState([
    { text: '👋 Hi! Ask me about any Pokémon by name or ID.', isUser: false },
  ]);
  const [input, setInput] = useState('');

  const fetchPokemon = async (query) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`
      );
      if (!response.ok) throw new Error('Pokémon not found!');
      const data = await response.json();
      const types = data.types.map((t) => t.type.name).join(', ');
      return ` ${data.name.toUpperCase()} (#${data.id})\nType: ${types}\nSprite: ${data.sprites.front_default}`;
    } catch (error) {
      return 'ERROR: Pokémon not found. Try another name or ID!';
    }
  };

  const handleSend = async () => {
    const trimmedQuery = input.trim(); // Remove any leading/trailing spaces
    if (!trimmedQuery) return; // Ignore empty messages

    // Add user's message
    const userMessage = { text: trimmedQuery, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    setInput(''); // Clear input field

    // Check if input looks like a Pokémon name/ID
    const pokeRegex = /^[a-zA-Z]+$|^\d+$/;
    if (pokeRegex.test(trimmedQuery)) {
      // Bot fetching Pokémon
      const botReply = await fetchPokemon(trimmedQuery);
      setMessages((prev) => [...prev, { text: botReply, isUser: false }]);
    } else {
      // Normal bot response
      setMessages((prev) => [
        ...prev,
        { text: '🤖 I can only provide Pokémon info. Try a name or ID.', isUser: false },
      ]);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <AutoStoriesIcon sx={{ mr: 1, color: darkTheme.palette.primary.main }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Botak
            </Typography>
            <IconButton color="inherit">
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Chat area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 2,
            overflowY: 'auto',
            backgroundColor: 'background.default',
          }}
        >
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.isUser}>
              {/* Animation wrapper */}
              <Box
                sx={{
                  animation: 'fadeInUp 0.3s ease forwards',
                  '@keyframes fadeInUp': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                {msg.text.includes('Sprite:') ? (() => {
                  const lines = msg.text.split('\n');
                  const spriteUrl = lines[2].replace('Sprite: ', '');
                  return (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <img
                        src={spriteUrl}
                        alt="pokemon"
                        style={{ width: 80, height: 80, borderRadius: 8 }}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Typography variant="body1">{lines[0]}</Typography>
                        <Typography variant="body2" color="text.secondary">{lines[1]}</Typography>
                      </Box>
                    </Box>
                  );
                })() : (
                  <Typography>{msg.text}</Typography>
                )}
              </Box>
            </MessageBubble>
          ))}
        </Box>


        {/* Input area */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderTop: `1px solid ${darkTheme.palette.divider}`,
            backgroundColor: 'background.paper',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type Pokémon name or ID..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            sx={{
              input: { color: 'text.primary' },
              backgroundColor: 'background.default',
              borderRadius: 2,
            }}
          />
          <Button
            onClick={handleSend}
            variant="contained"
            color="primary"
            sx={{ ml: 2, borderRadius: 3, minWidth: 48, height: 48 }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
