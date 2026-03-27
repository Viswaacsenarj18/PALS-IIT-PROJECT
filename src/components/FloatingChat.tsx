import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: userMsg.text,
          context: window.productContext || 'General HillSmart farming chat',
          productId: window.productId || null 
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "No response" },
      ]);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 💬 FLOAT BUTTON */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition z-50"
        >
          <MessageCircle size={22} />
        </button>
      )}

      {/* 💎 CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 h-[460px] bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 border border-white/30">

          {/* HEADER */}
          <div className="flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-3">
            <h2 className="font-semibold">🌱 HillSmart AI</h2>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 text-sm">
                Ask about crops, soil, irrigation 🌾
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[75%] text-sm shadow ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-gray-400">🤖 Typing...</p>
            )}
          </div>

          {/* INPUT */}
          <div className="flex border-t p-2 gap-2 bg-white">
            <input
              className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}