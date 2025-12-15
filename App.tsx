import React, { useState, useEffect, useRef } from "react";
import { sendMessageToGemini } from "./services/geminiService";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: input },
    ];

    setMessages(newMessages);
    setInput("");

    const reply = await sendMessageToGemini(newMessages);

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        text:
          reply ||
          "제주 여행에 대해 더 구체적으로 말씀해 주세요 😊",
      },
    ]);
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 20 }}>
      <h2>차니 봇</h2>

      <div style={{ height: "60vh", overflowY: "auto", background: "#f5f5f5", padding: 10 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === "user" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: 8,
                background: m.role === "user" ? "#1e6bff" : "#e5e5e5",
                color: m.role === "user" ? "#fff" : "#000",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: 8 }}
        />
        <button type="button" onClick={handleSend}>
          보내기
        </button>
      </div>
    </div>
  );
}
