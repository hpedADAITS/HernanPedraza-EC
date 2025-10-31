import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import UserMessageBubble from "./Bubbles/UserMessageBubble";
import BotMessageBubble from "./Bubbles/BotMessageBubble";

export default function MessageList({ messages, currentEndpoint }) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        p: 2,
        overflowY: "auto",
        backgroundColor: "background.default",
      }}
    >
      {messages.map((msg, index) =>
        msg.type === "user" ? (
          <UserMessageBubble key={index} text={msg.text} currentEndpoint={currentEndpoint} />
        ) : (
          <BotMessageBubble key={index} message={msg} />
        )
      )}
      <div ref={chatEndRef} />
    </Box>
  );
}
