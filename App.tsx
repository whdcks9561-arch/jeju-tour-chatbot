import React, { useState } from "react";
import { sendMessageToGemini } from "./services/geminiService";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const send = async (text: string) => {
    if (!text.trim()) return;

    const next = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");

    const reply = await sendMessageToGemini(next);
    setMessages([...next, { role: "bot", text: reply }]);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <h2>차니 봇</h2>

      <div style={{ minHeight: 300 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              margin: "6px 0",
              padding: "10px",
              borderRadius: 8,
              background: m.role === "user" ? "#1E6BFF" : "#EEE",
              color: m.role === "user" ? "#FFF" : "#000",
              maxWidth: "80%",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <button onClick={() => send("안녕")}>안녕</button>
        <button onClick={() => send("제주 관광지 리스트")}>리스트</button>
        <button onClick={() => send("2박 3일 일정 추천")}>일정</button>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1 }}
        />
        <button onClick={() => send(input)}>보내기</button>
      </div>
    </div>
  );
}
