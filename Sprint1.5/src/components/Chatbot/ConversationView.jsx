import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../Layout/Header";
import ChatWindow from "./ChatWindow";
import ConversationNotFound from "../Error/ConversationNotFound";
import { conversationManager } from "../../services/conversationManager";

const ConversationView = ({ isDarkMode, onToggleTheme, currentUser, onLogout }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const handleBackToHistory = () => {
    navigate(`/${currentUser}/conversations`);
  };

  // Check if conversation exists
  const conversation = conversationManager.getConversation(conversationId);

  if (!conversation) {
    return <ConversationNotFound currentUser={currentUser} />;
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
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onBackToHistory={handleBackToHistory}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <ChatWindow
        conversationId={conversationId}
        onBackToHistory={handleBackToHistory}
      />
    </Box>
  );
};

export default ConversationView;
