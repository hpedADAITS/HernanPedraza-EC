import React, { useState } from "react";
import { Box } from "@mui/material";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { fetchPokemon } from "../../services/pokeapi";

export default function ChatWindow() {
  const [messages, setMessages] = useState([{ type: "bot", text: "👋 Hi! Ask me about any Pokémon by name or ID." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleSend = async () => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return;
    setHistory((prev) => [...prev, trimmedQuery]);
    setHistoryIndex(-1);

    setMessages((prev) => [...prev, { type: "user", text: trimmedQuery }]);
    setInput("");

    const pokeRegex = /^[a-zA-Z]+$|^\d+$/;
    if (pokeRegex.test(trimmedQuery)) {
      setLoading(true);
      setMessages((prev) => [...prev, { type: "bot", text: "🤖 Bot is typing..." }]);

      let botReply;
      if (trimmedQuery.toLowerCase() === "missingno") {
        botReply = { type: "bot", text: "🌀 Feeling NULL?" };
      } else {
        botReply = await fetchPokemon(trimmedQuery);
      }

      setMessages((prev) => [...prev.filter((m) => m.text !== "🤖 Bot is typing..."), botReply]);
      setLoading(false);
    } else {
      setMessages((prev) => [...prev, { type: "bot", text: "🤖 I can only provide Pokémon info. Try a name or ID." }]);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MessageList messages={messages} />
      <MessageInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        history={history}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
      />
    </Box>
  );
}
