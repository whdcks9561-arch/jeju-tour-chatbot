import { useState } from "react";
import { sendMessageToGemini } from "./services/geminiService";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    try {
      const reply = await sendMessageToGemini(userText);
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ 서버 오류" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: 360, margin: "0 auto", padding: 16 }}>
      <h3>차니 봇</h3>

      <div style={{ minHeight: 400 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.role === "user" ? "나" : "봇"}:</b> {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend} disabled={loading}>
          보내기
        </button>
      </div>
    </div>
  );
}
