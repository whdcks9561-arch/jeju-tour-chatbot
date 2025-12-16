import { useState } from "react";

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

    // 1️⃣ 사용자 메시지 먼저 추가
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userText },
    ]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      // 🔥 핵심: data.text 사용
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.text || "⚠️ 응답이 없습니다.",
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "❌ 서버 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>차니 봇</h2>

      <div style={{ minHeight: 300 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role === "user" ? "나" : "봇"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSend} disabled={loading}>
        보내기
      </button>
    </div>
  );
}
