import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
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
      <Box
        sx={{
          "& p": { margin: 0, marginBottom: "0.5em" },
          "& p:last-child": { marginBottom: 0 },
          "& code": {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            padding: "2px 6px",
            borderRadius: "3px",
            fontFamily: "monospace",
            fontSize: "0.9em",
          },
          "& pre": {
            margin: "0.5em 0",
            borderRadius: "6px",
            overflow: "auto",
          },
          "& strong": {
            fontWeight: "bold",
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </Box>
    </BaseBubble>
  );
};

export default BotMessageBubble;
