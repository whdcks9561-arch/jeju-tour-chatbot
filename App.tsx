import { useState } from "react";
import { sendMessageToGemini } from "./services/sendMessageToGemini";

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

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const reply = await sendMessageToGemini(userMessage);

      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ 오류가 발생했습니다." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-slate-50">
      <div className="w-[400px] h-[600px] bg-white rounded-xl shadow flex flex-col">
        <div className="p-4 font-bold border-b">차니 봇</div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                m.role === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200"
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && (
            <div className="mr-auto bg-gray-200 px-3 py-2 rounded-lg text-sm">
              ...
            </div>
          )}
        </div>

        <div className="p-3 border-t flex gap-2">
          <input
            className="flex-1 border rounded px-2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요"
          />
          <button
            className="bg-blue-500 text-white px-3 rounded"
            onClick={handleSend}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
