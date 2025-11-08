import React, { useState, useEffect, useRef } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import OpenAIService from "../../services/openai";
import { getEndpointConfig } from "../../config/endpoints";
import { conversationManager } from "../../services/conversationManager";
import { useHistoryState } from "../../hooks/useHistoryState";
import { useTemperature } from "../../hooks/useTemperature";

export default function ChatWindow({ conversationId, onBackToHistory }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showLmStudioModal, setShowLmStudioModal] = useState(false);
  const messageInputRef = useRef(null);
  const { setFocus } = useHistoryState();
  const { temperature } = useTemperature();

  useEffect(() => {
    if (conversationId) {
      const conversation = conversationManager.getConversation(conversationId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    }
    if (!sessionStorage.getItem("lmstudioModalShown")) {
      setShowLmStudioModal(true);
    }
    // Focus on message input when entering conversation
    setFocus("message-input");
  }, [conversationId, setFocus]);

  const lmStudioConfig = getEndpointConfig("lmstudio");
  const openai = OpenAIService(lmStudioConfig.baseUrl);

  const handleCloseModal = () => {
    setShowLmStudioModal(false);
    sessionStorage.setItem("lmstudioModalShown", "true");
  };

  const handleSend = async () => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return;
    setHistory((prev) => [...prev, trimmedQuery]);
    setHistoryIndex(-1);

    const userMessage = { type: "user", text: trimmedQuery };
    const messagesWithUser = [...messages, userMessage, { type: "bot", text: "🤖 Bot is typing..." }];
    
    setMessages(messagesWithUser);
    setInput("");
    setLoading(true);

    if (conversationId) {
      conversationManager.updateMessages(conversationId, messagesWithUser);
    }

    try {
      const messageHistory = messages
        .filter((m) => m.type === "user" || m.type === "bot")
        .map((m) => ({
          role: m.type === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const response = await openai.chatCompletions({
        model: lmStudioConfig.model,
        messages: [
          ...messageHistory,
          { role: "user", content: trimmedQuery },
        ],
        temperature: temperature,
        max_tokens: -1,
        stream: false,
      });

      const text = openai.extractText(response);
      const botReply = { type: "bot", text };

      const updatedMessages = [
        ...messagesWithUser.filter((m) => m.text !== "🤖 Bot is typing..."),
        botReply,
      ];
      setMessages(updatedMessages);
      if (conversationId) {
        conversationManager.updateMessages(conversationId, updatedMessages);
      }
    } catch (error) {
      const errorMessages = [
        ...messagesWithUser.filter((m) => m.text !== "🤖 Bot is typing..."),
        { type: "bot", text: `❌ Error: ${error.message}` },
      ];
      setMessages(errorMessages);
      if (conversationId) {
        conversationManager.updateMessages(conversationId, errorMessages);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ display: "flex", flexDirection: "column", height: "100%", position: "relative", overflow: "hidden" }}
      data-preserve-scroll="message-list"
    >
      <MessageList messages={messages} />
      <MessageInput
        ref={messageInputRef}
        inputId="message-input"
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        history={history}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
      />
      <Modal
        open={showLmStudioModal}
        onClose={handleCloseModal}
        BackdropProps={{
          style: { backdropFilter: "blur(5px)" },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            LM Studio Setup
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Make sure LM Studio is running in order to use the API.
          </Typography>
          <Button onClick={handleCloseModal} variant="contained" sx={{ mt: 2 }}>
            OK
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
