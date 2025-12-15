import React, { useState } from "react";
import { sendMessageToGemini } from "./services/geminiService";

export default function App() {
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [input, setInput] = useState("");

  const handleSend = async (text?: string) => {
    const content = text ?? input;
    if (!content.trim()) return;

    const nextMessages = [...messages, { role: "user", text: content }];
    setMessages(nextMessages);
    setInput("");

    const reply = await sendMessageToGemini(nextMessages);

    setMessages([
      ...nextMessages,
      { role: "bot", text: reply },
    ]);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <h2>차니 봇</h2>

      <div style={{ minHeight: 400 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              margin: "8px 0",
              padding: "8px 12px",
              borderRadius: 8,
              background: m.role === "user" ? "#1E6BFF" : "#EEE",
              color: m.role === "user" ? "#FFF" : "#000",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* 빠른 버튼 테스트 */}
      <button onClick={() => handleSend("리스트")}>리스트</button>
      <button onClick={() => handleSend("관광지 추천")}>관광지</button>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1 }}
        />
        <button onClick={() => handleSend()}>보내기</button>
      </div>
    </div>
  );
}
