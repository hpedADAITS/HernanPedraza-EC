import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import BaseBubble from "./BaseBubble";

const BotMessageBubble = ({ message }) => {
  if (message.type === "pokemon") {
    return (
      <BaseBubble isUser={false}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img
            src={message.sprite}
            alt={message.name}
            style={{ width: 80, height: 80, borderRadius: 8 }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="h6">{`${message.name} (#${message.id})`}</Typography>
            <Typography variant="body1" color="text.secondary">
              Type: {message.types}
            </Typography>
          </Box>
        </Box>
      </BaseBubble>
    );
  }

  if (message.text === "🤖 Bot is typing...") {
    return (
      <BaseBubble isUser={false}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CircularProgress size={16} color="inherit" />
          <Typography variant="body1">{message.text}</Typography>
        </Box>
      </BaseBubble>
    );
  }

  return (
    <BaseBubble isUser={false}>
      <Typography variant="body1">{message.text}</Typography>
    </BaseBubble>
  );
};

export default BotMessageBubble;
