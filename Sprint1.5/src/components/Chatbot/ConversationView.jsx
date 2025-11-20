import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../Layout/Header";
import ChatWindow from "./ChatWindow";
import ConversationNotFound from "../Error/ConversationNotFound";
import Loading from "../Shared/Loading";
import ErrorBlock from "../Shared/ErrorBlock";
import { conversationManager } from "../../services/conversationManager";

const ConversationView = ({ isDarkMode, onToggleTheme, currentUser, onLogout }) => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBackToHistory = () => {
    navigate(`/${currentUser}/conversations`);
  };

  // Fetch conversation on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await conversationManager.getConversation(conversationId);
        if (!data) {
          setConversation(null);
        } else {
          setConversation(data);
        }
      } catch (err) {
        console.error("Error loading conversation:", err);
        setError(err.message || "Failed to load conversation");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [conversationId]);

  if (loading) {
    return <Loading message="Loading conversation..." />;
  }

  if (error) {
    return <ErrorBlock message={error} onRetry={() => window.location.reload()} />;
  }

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
