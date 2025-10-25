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
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderTop: `1px solid`,
        backgroundColor: "background.paper",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type Pokémon name or ID..."
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
        sx={{ ml: 2, borderRadius: 3, minWidth: 48, height: 48 }}
      >
        <SendIcon />
      </Button>
    </Box>
  );
}
