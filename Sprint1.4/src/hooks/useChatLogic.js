import { useState } from "react";
import { APP_CONSTANTS } from "../utils/constants";
import { fetchPokemon } from "../services/pokeapi";

export const useChatLogic = (onChatStateChange) => {
  const [messages, setMessages] = useState([
    { type: "bot", text: APP_CONSTANTS.MESSAGES.WELCOME },
  ]);
  const [chatStarted, setChatStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    const trimmedQuery = input.trim();
    if (!trimmedQuery) return;

    if (!chatStarted) {
      setChatStarted(true);
      onChatStateChange?.(true);
    }

    setHistory((prev) => [...prev, trimmedQuery]);
    setHistoryIndex(-1);
    setMessages((prev) => [...prev, { type: "user", text: trimmedQuery }]);
    setInput("");

    if (APP_CONSTANTS.POKEMON_REGEX.test(trimmedQuery)) {
      setLoading(true);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: APP_CONSTANTS.MESSAGES.BOT_TYPING },
      ]);

      let botReply;
      if (trimmedQuery.toLowerCase() === "missingno") {
        botReply = { type: "bot", text: APP_CONSTANTS.MESSAGES.MISSINGNO };
      } else {
        botReply = await fetchPokemon(trimmedQuery);
      }

      setMessages((prev) => [
        ...prev.filter((m) => m.text !== APP_CONSTANTS.MESSAGES.BOT_TYPING),
        botReply,
      ]);
      setLoading(false);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: APP_CONSTANTS.MESSAGES.INVALID_INPUT,
        },
      ]);
    }
  };

  return {
    messages,
    chatStarted,
    input,
    setInput,
    loading,
    history,
    historyIndex,
    setHistoryIndex,
    handleSend,
  };
};
