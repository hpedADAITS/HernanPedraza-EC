import React, { useState, useRef, useEffect } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/system';
import SendIcon from '@mui/icons-material/Send';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

// Themes
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#90CAF9', dark: '#42a5f5' },
    background: { default: '#121212', paper: '#1E1E1E' },
    text: { primary: '#E0E0E0', secondary: '#B0B0B0' },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2', dark: '#115293' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
    text: { primary: '#000000', secondary: '#555555' },
  },
});

// Styled message bubble
const MessageBubble = styled(Paper, { shouldForwardProp: (prop) => prop !== 'isUser' })(
  ({ theme, isUser }) => ({
    position: 'relative',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? theme.palette.primary.dark : theme.palette.background.paper,
    color: isUser ? '#fff' : theme.palette.text.primary,
    padding: '10px 15px',
    borderRadius: 10,
    maxWidth: '75%',
    marginBottom: 16,
    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
    fontSize: '1rem',
    lineHeight: 1.4,
    opacity: 0,
    transform: 'translateY(10px)',
    animation: 'fadeInUp 0.3s ease forwards',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      ...(isUser
        ? {
          borderWidth: '10px 0 10px 10px',
          borderColor: `transparent transparent transparent ${theme.palette.primary.dark}`,
          right: -9,
          top: 13,
        }
        : {
          borderWidth: '10px 10px 10px 0',
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
          left: -9,
          top: 13,
        }),
    },
    '@keyframes fadeInUp': {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
  })
);

export default function App() {
  const [messages, setMessages] = useState([{ type: 'bot', text: '👋 Hi! Ask me about any Pokémon by name or ID.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch Pokémon
  const fetchPokemon = async (query) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`);
      if (!response.ok) throw new Error('Pokémon not found!');
      const data = await response.json();
      return {
        type: 'pokemon',
        name: data.name.toUpperCase(),
        id: data.id,
        types: data.types.map((t) => t.type.name).join(', '),
        sprite: data.sprites.front_default,
      };
    } catch (error) {
      return { type: 'bot', text: '❌ Pokémon not found. Try another name or ID!' };
    }
  };

  const handleSend = async () => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return;

    // Save to history
    setHistory((prev) => [...prev, trimmedQuery]);
    setHistoryIndex(-1); // Reset index after sending

    setMessages((prev) => [...prev, { type: 'user', text: trimmedQuery }]);
    setInput('');

    const pokeRegex = /^[a-zA-Z]+$|^\d+$/;
    if (pokeRegex.test(trimmedQuery)) {
      setLoading(true);
      const loadingMessage = { type: 'bot', text: '🤖 Bot is typing...' };
      setMessages((prev) => [...prev, loadingMessage]);

      const botReply = await fetchPokemon(trimmedQuery);

      setMessages((prev) => [
        ...prev.filter((m) => m.text !== '🤖 Bot is typing...'),
        botReply,
      ]);
      setLoading(false);
    } else {
      setMessages((prev) => [...prev, { type: 'bot', text: '🤖 I can only provide Pokémon info. Try a name or ID.' }]);
    }
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Header */}
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <AutoStoriesIcon sx={{ mr: 1, color: isDarkMode ? darkTheme.palette.primary.main : lightTheme.palette.primary.main }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Botak
            </Typography>
            <IconButton color="inherit" onClick={() => setIsDarkMode(!isDarkMode)}>
              <DarkModeIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Chat area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', p: 2, overflowY: 'auto', backgroundColor: 'background.default' }}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.type === 'user'}>
              {msg.type === 'pokemon' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img src={msg.sprite} alt={msg.name} style={{ width: 80, height: 80, borderRadius: 8 }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography variant="body1">{`${msg.name} (#${msg.id})`}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {msg.types}
                    </Typography>
                  </Box>
                </Box>
              ) : msg.text === '🤖 Bot is typing...' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  <Typography>{msg.text}</Typography>
                </Box>
              ) : (
                <Typography>{msg.text}</Typography>
              )}
            </MessageBubble>
          ))}
          <div ref={chatEndRef} />
        </Box>

        {/* Input area */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderTop: `1px solid ${isDarkMode ? darkTheme.palette.divider : lightTheme.palette.divider}`, backgroundColor: 'background.paper' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type Pokémon name or ID..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              } else if (e.key === 'ArrowUp') {
                if (history.length === 0) return;
                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
                e.preventDefault();
              } else if (e.key === 'ArrowDown') {
                if (history.length === 0) return;
                if (historyIndex === -1) return;
                const newIndex = Math.min(history.length - 1, historyIndex + 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex] || '');
                e.preventDefault();
              }
            }}
            sx={{ input: { color: 'text.primary' }, backgroundColor: 'background.default', borderRadius: 2 }}
          />

          <Button onClick={handleSend} variant="contained" color="primary" sx={{ ml: 2, borderRadius: 3, minWidth: 48, height: 48 }}>
            <SendIcon />
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
