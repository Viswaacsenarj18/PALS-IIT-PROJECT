import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST", // ✅ IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg.text,
        }),
      });

      const data = await res.json();

      const botMsg = {
        sender: "bot",
        text: data.reply || "No response",
      };

      setMessages((prev) => [...prev, botMsg]);

    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg rounded-xl p-3 z-50">

      {/* HEADER */}
      <div className="text-center font-bold mb-2 text-green-600">
        🌱 HillSmart AI
      </div>

      {/* MESSAGES */}
      <div className="h-60 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center">
            Ask me anything about farming 🌾
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "text-right" : "text-left"}
          >
            <p
              className={`inline-block p-2 rounded m-1 text-sm ${
                msg.sender === "user"
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}

        {loading && (
          <p className="text-xs text-gray-400">Typing...</p>
        )}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-3 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}