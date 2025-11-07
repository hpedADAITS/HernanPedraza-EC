import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, IconButton, Chip } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MessageList from "../Chatbot/MessageList";
import { conversationManager } from "../../services/conversationManager";
import ConversationNotFound from "../Error/ConversationNotFound";

const SharedConversationView = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const conv = conversationManager.getConversationByShareToken(shareToken);
    setConversation(conv);
    setLoading(false);
  }, [shareToken]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100dvh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!conversation) {
    return <ConversationNotFound currentUser={null} />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        pt: "env(safe-area-inset-top)",
        pl: "env(safe-area-inset-left)",
        pr: "env(safe-area-inset-right)",
        overflow: "hidden",
      }}
    >
      <AppBar position="sticky" elevation={1} color="transparent">
        <Toolbar>
          <AutoStoriesIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {conversation.title}
          </Typography>
          <Chip label="Shared View" size="small" color="primary" variant="outlined" />
        </Toolbar>
      </AppBar>
      
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <MessageList messages={conversation.messages} />
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          This is a read-only shared conversation.
        </Typography>
      </Box>
    </Box>
  );
};

export default SharedConversationView;
