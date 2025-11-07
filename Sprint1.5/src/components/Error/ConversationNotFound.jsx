import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ConversationNotFound = ({ currentUser }) => {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const handleGoToConversations = () => {
    if (currentUser) {
      navigate(`/${currentUser}/conversations`);
    } else {
      navigate("/login");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
          <ChatIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
            Conversation Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            The conversation with ID "{conversationId}" doesn't exist or has been deleted.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            It may have been removed or you might have an incorrect link.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Go Back
            </Button>
            <Button
              variant="contained"
              startIcon={<ChatIcon />}
              onClick={handleGoToConversations}
            >
              Conversations
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConversationNotFound;
