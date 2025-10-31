import React, { useState } from "react";
import { Box } from "@mui/material";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { fetchPokemon } from "../../services/pokeapi";
import OpenAIService from "../../services/openai";
import { getEndpointConfig } from "../../config/endpoints";

export default function ChatWindow({ currentEndpoint, onEndpointChange }) {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! Ask me about any Pokémon by name or ID, or switch to LM Studio for AI chat!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const lmStudioConfig = getEndpointConfig("lmstudio");
  const openai = OpenAIService(lmStudioConfig.baseUrl);

  const handleSend = async () => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return;
    setHistory((prev) => [...prev, trimmedQuery]);
    setHistoryIndex(-1);

    setMessages((prev) => [...prev, { type: "user", text: trimmedQuery }]);
    setInput("");
    setLoading(true);

    try {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "🤖 Bot is typing..." },
      ]);

      let botReply;

      if (currentEndpoint === "pokeapi") {
        const pokeRegex = /^[a-zA-Z]+$|^\d+$/;
        if (!pokeRegex.test(trimmedQuery)) {
          botReply = {
            type: "bot",
            text: "🤖 I can only provide Pokémon info in PokeAPI mode. Try a name or ID.",
          };
        } else if (trimmedQuery.toLowerCase() === "missingno") {
          botReply = { type: "bot", text: "🌀 Feeling NULL?" };
        } else {
          botReply = await fetchPokemon(trimmedQuery);
        }
      } else if (currentEndpoint === "lmstudio") {
        // Ensure messages array is properly structured
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
          temperature: 0.7,
          max_tokens: -1,
          stream: false,
        });

        const text = openai.extractText(response);
        botReply = { type: "bot", text };
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.text !== "🤖 Bot is typing..."),
        botReply,
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.filter((m) => m.text !== "🤖 Bot is typing..."),
        { type: "bot", text: `❌ Error: ${error.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentEndpoint === "lmstudio") {
      setMessages([]);
    }
  }, [currentEndpoint]);

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
