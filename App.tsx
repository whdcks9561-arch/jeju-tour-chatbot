import React, { useState } from "react";
import { sendMessageToGemini } from "./services/geminiService";

export default function App() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError("");

    try {
      const reply = await sendMessageToGemini(input);

   const botMessage = {
  role: "bot",
  text: reply || "안녕하세요! 😊 제주 여행에 대해 무엇이든 물어보세요.",
};


      setMessages((prev) => [...prev, botMessage]);
    } catch (e) {
      console.error("메시지 처리 중 오류:", e);
      setError("메시지를 처리하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>차니 봇</h2>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              background: msg.role === "user" ? "#1E6BFF" : "#EEE",
              color: msg.role === "user" ? "#fff" : "#000",
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button style={styles.button} onClick={handleSend}>
          보내기
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    padding: 20,
    fontFamily: "sans-serif",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    background: "#F5F5F5",
    padding: 20,
    height: "60vh",
    overflowY: "auto" as const,
    borderRadius: 10,
    marginBottom: 20,
  },
  message: {
    padding: "10px 14px",
    borderRadius: 8,
    maxWidth: "80%",
    fontSize: 15,
  },
  inputRow: {
    display: "flex",
    gap: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #CCC",
  },
  button: {
    padding: "10px 18px",
    background: "#007BFF",
    color: "#fff",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
};
