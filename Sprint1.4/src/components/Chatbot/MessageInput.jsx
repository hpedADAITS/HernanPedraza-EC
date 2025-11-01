import React from "react";
import { Box, TextField, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function MessageInput({
  input,
  setInput,
  handleSend,
  history,
  historyIndex,
  setHistoryIndex,
  currentEndpoint,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: { xs: 1, sm: 2 },
        pb: {
          xs: 'max(calc(1 * 8px + env(safe-area-inset-bottom)), 8px)',
          sm: 2
        },
        pl: {
          xs: 'max(calc(1 * 8px + env(safe-area-inset-left)), 8px)',
          sm: 2
        },
        pr: {
          xs: 'max(calc(1 * 8px + env(safe-area-inset-right)), 8px)',
          sm: 2
        },
        borderTop: `1px solid`,
        backgroundColor: "background.paper",
        position: "sticky",
        bottom: 0,
        zIndex: 1,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder={
          currentEndpoint === "lmstudio"
            ? "Input your message to Botak..."
            : "Type Pokémon name or ID..."
        }
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
          else if (e.key === "ArrowUp") {
            if (!history.length) return;
            const newIndex =
              historyIndex === -1
                ? history.length - 1
                : Math.max(0, historyIndex - 1);
            setHistoryIndex(newIndex);
            setInput(history[newIndex]);
            e.preventDefault();
          } else if (e.key === "ArrowDown") {
            if (!history.length || historyIndex === -1) return;
            const newIndex = Math.min(history.length - 1, historyIndex + 1);
            setHistoryIndex(newIndex);
            setInput(history[newIndex] || "");
            e.preventDefault();
          }
        }}
        sx={{
          input: { color: "text.primary" },
          backgroundColor: "background.default",
          borderRadius: "12px",
        }}
      />
      <Button
        onClick={handleSend}
        variant="contained"
        color="primary"
        sx={{
          ml: { xs: 1, sm: 2 },
          borderRadius: 3,
          minWidth: { xs: 40, sm: 48 },
          height: { xs: 40, sm: 48 },
          p: { xs: 1, sm: 1.5 }
        }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}
