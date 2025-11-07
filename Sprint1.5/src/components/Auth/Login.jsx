import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Card, Alert } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/.creds");
      const credsText = await response.text();
      
      const validCreds = credsText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const isValid = validCreds.some(cred => {
        const [user, pass] = cred.split(" ");
        return user === username && pass === password;
      });

      if (isValid) {
        onLoginSuccess(username);
        navigate(`/${username}/conversations`);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Error reading credentials file");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
      }}
    >
      <Card
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, justifyContent: "center" }}>
          <LockIcon sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Botak
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
          Sign in to continue
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </Card>
    </Box>
  );
};

export default Login;
