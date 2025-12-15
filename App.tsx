import React, { useState } from "react";
import { sendMessageToGemini } from "./services/geminiService";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // ✅ 실제 전송 함수
  const send = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    try {
      const reply = await sendMessageToGemini(nextMessages);
      setMessages([
        ...nextMessages,
        { role: "bot", text: reply },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "bot", text: "오류가 발생했어요 😢" },
      ]);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <h2>차니 봇</h2>

      {/* 메시지 영역 */}
      <div style={{ minHeight: 400 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              margin: "8px 0",
              padding: "10px 14px",
              borderRadius: 8,
              background: m.role === "user" ? "#1E6BFF" : "#EEE",
              color: m.role === "user" ? "#FFF" : "#000",
              maxWidth: "80%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* 빠른 버튼 (🔥 핵심 수정 부분) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button onClick={() => send("안녕")}>안녕</button>
        <button onClick={() => send("리스트")}>리스트</button>
        <button onClick={() => send("관광지 추천")}>관광지</button>
      </div>

      {/* 입력창 */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1 }}
          value={input}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
        />
        <button onClick={() => send(input)}>보내기</button>
      </div>
    </div>
  );
}
