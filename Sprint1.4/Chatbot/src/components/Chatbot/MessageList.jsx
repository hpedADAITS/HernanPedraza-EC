import React, { useEffect, useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { styled } from "@mui/system";

const MessageBubble = styled("div")(({ theme, isUser }) => ({
  position: "relative",
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser ? theme.palette.primary.dark : theme.palette.background.paper,
  color: isUser ? "#fff" : theme.palette.text.primary,
  padding: "10px 15px",
  borderRadius: 10,
  maxWidth: "75%",
  marginBottom: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  fontSize: "1rem",
  lineHeight: 1.4,
  opacity: 0,
  transform: "translateY(10px)",
  animation: "fadeInUp 0.3s ease forwards",
  "&::before": {
    content: '""',
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    ...(isUser
      ? { borderWidth: "10px 0 10px 10px", borderColor: `transparent transparent transparent ${theme.palette.primary.dark}`, right: -9, top: 13 }
      : { borderWidth: "10px 10px 10px 0", borderColor: `transparent ${theme.palette.background.paper} transparent transparent`, left: -9, top: 13 }),
  },
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

export default function MessageList({ messages }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2, overflowY: "auto", backgroundColor: "background.default" }}>
      {messages.map((msg, index) => (
        <MessageBubble key={index} isUser={msg.type === "user"}>
          {msg.type === "pokemon" ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={msg.sprite} alt={msg.name} style={{ width: 80, height: 80, borderRadius: 8 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography variant="body1">{`${msg.name} (#${msg.id})`}</Typography>
                <Typography variant="body2" color="text.secondary">Type: {msg.types}</Typography>
              </Box>
            </Box>
          ) : msg.text === "🤖 Bot is typing..." ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
  );
}
