import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";

const NotFound = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (currentUser) {
      navigate(`/${currentUser}/conversations`);
    } else {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          mx: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <CardContent sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold", color: "text.secondary", mb: 2 }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={currentUser ? <ChatIcon /> : <HomeIcon />}
            onClick={handleGoHome}
            sx={{ minWidth: 200 }}
          >
            {currentUser ? "Go to Conversations" : "Go to Login"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;
