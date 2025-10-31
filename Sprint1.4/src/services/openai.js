const DEFAULT_BASE = "http://localhost:1234";

async function chatCompletionRequest(url, payload, options = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      ...options,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Request failed: ${response.status} - ${text}`);
    }

    if (payload.stream) {
      return response;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Chat completion request failed:", error);
    throw error;
  }
}

export const OpenAIService = (baseUrl = DEFAULT_BASE, apiKey) => {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };

  return {
    getModels: async () => {
      const url = `${baseUrl.replace(/\/$/, "")}/v1/models`;
      return requestJson(url, { method: "GET", headers });
    },

    responses: async (payload, { onStream } = {}) => {
      const url = `${baseUrl.replace(/\/$/, "")}/v1/responses`;

      // If streaming is requested and onStream callback is provided
      if (payload.stream && typeof onStream === "function") {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
            Accept: "text/event-stream",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Request failed: ${response.status} - ${error}`);
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // Keep incomplete line in buffer

            for (const line of lines) {
              if (line.trim() === "" || !line.startsWith("data: ")) continue;

              const data = line.slice(5).trim(); // Remove 'data: ' prefix and trim
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);
                onStream(event);
              } catch (e) {
                // If it's not JSON, try sending it as a text event
                if (data) {
                  onStream({ type: "response.output_text.delta", text: data });
                }
              }
            }
          }
        } catch (error) {
          throw new Error(`Stream processing failed: ${error.message}`);
        } finally {
          reader.releaseLock();
        }

        return null; // Streaming responses are handled via callback
      }

      // Non-streaming request
      return requestJson(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...payload,
          stream: false, // Ensure non-streaming for regular requests
        }),
      });
    },

    chatCompletions: async (payload, { onStream } = {}) => {
      const url = `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;
      
      console.log("chatCompletions payload:", JSON.stringify(payload, null, 2));

      // If streaming is requested and onStream callback is provided
      if (payload.stream && typeof onStream === "function") {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`Request failed: ${response.status} - ${error}`);
        }

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim() === "" || !line.startsWith("data: ")) continue;

              const data = line.slice(6).trim();
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);
                onStream(event);
              } catch (e) {
                console.error("Failed to parse SSE data:", e);
              }
            }
          }
        } catch (error) {
          throw new Error(`Stream processing failed: ${error.message}`);
        } finally {
          reader.releaseLock();
        }

        return null;
      }

      // Non-streaming request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Request failed: ${response.status} - ${error}`);
      }

      return await response.json();
    },

    completions: async (payload) => {
      const url = `${baseUrl.replace(/\/$/, "")}/v1/completions`;
      return requestJson(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    },

    embeddings: async (payload) => {
      const url = `${baseUrl.replace(/\/$/, "")}/v1/embeddings`;
      return requestJson(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
    },

    // helper that normalizes common response shapes into a plain text reply
    extractText: (resp) => {
      if (!resp) return null;
      // OpenAI chat completions
      if (resp.choices && resp.choices[0]) {
        const c = resp.choices[0];
        if (c.message && (c.message.content || c.message.content?.parts)) {
          // message.content could be string or { parts: [...] }
          if (typeof c.message.content === "string") return c.message.content;
          if (Array.isArray(c.message.content?.parts))
            return c.message.content.parts.join("\n");
        }
        if (c.text) return c.text; // completions
      }

      // "responses" style (e.g., Anthropic-like or other)
      if (Array.isArray(resp.output) && resp.output[0]) {
        const out = resp.output[0];
        if (typeof out === "string") return out;
        if (out.content) {
          // content might be array of { type, text }
          if (Array.isArray(out.content)) {
            return out.content
              .map((p) => p.text || p?.data?.text || JSON.stringify(p))
              .join("\n");
          }
        }
      }

      // direct text
      if (typeof resp === "string") return resp;
      // fallback to JSON-string
      try {
        return JSON.stringify(resp);
      } catch {
        return String(resp);
      }
    },
  };
};

export default OpenAIService;
